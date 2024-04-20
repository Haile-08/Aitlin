import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { Bill, Blog, Nurse, Service, User } from '../../database';
import { sendEmail } from '../../utils';
import path from 'path';
import fs from 'fs';
import archiver from 'archiver';
import uuid4 from 'uuid4';

/* Represent a run time controller*/
class adminController {
  /**
   * add a new client
   * @param req request object
   * @param res response object
   */
  static async handleAddClient(req: Request, res: Response){
    try {
      const { Name, status, ServiceData, email, Notification } = req.body;

      if (!email || !Name || !status || !ServiceData) {
        return res.json({ 
          message: 'All fields are required',
          success: false
        });
      }

      const existingUser = await User.findOne({ email });

      if (status == 'new'){
        if (existingUser) {
          return res.json({ 
            message: 'Client already exists',
            success: false, 
          });
        }
        const salt = await bcrypt.genSalt();
        const password = Math.random().toString(36).slice(2, 10);
        const passwordHash = await bcrypt.hash(password, salt);

        const client = await User.create({
          Name,
          email,
          password: passwordHash,
          type: 'client',
          firstService: {},
        });

        const service = await Service.create({
          clientId: client._id,
          clientName: client.Name,
          serviceName: ServiceData,
          email: client.email,
          status: true,
          Notification: Notification || false,
        });

        await User.findOneAndUpdate({_id: client._id}, {firstService: {
          serviceId: service._id,
          serviceName: service.serviceName,
          clientName: service.clientName,
        }}, { new: true });

        sendEmail(
          client.email,
          'Welcome to Aitlin',
          {
            name: client.Name,
            email: client.email,
            password,
            link: undefined
          },
          './template/newClient.handlebars'
        );
        return res.status(201).json({
          message: 'Account created successfully',
          success: true,
          data: {
            client,
            service
          },
        });
      } else {
        if (!existingUser){
          return res.json({ 
            message: 'Client does not exists',
            success:  false,
          });
        }

        await User.findByIdAndUpdate(existingUser._id, {ServiceNumber: existingUser.ServiceNumber + 1}, { new: true });

        const service = await Service.create({
          clientId: existingUser._id,
          clientName: existingUser.Name,
          serviceName: ServiceData,
          email: existingUser.email,
          status: true,
          Notification: Notification || false,
        });

        return res.status(201).json({
          message: 'Service created successfully',
          success: true,
          data: service,
        });
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return res.status(500).json({ message: err.message, success: false  });
    
    }
  }

  /**
     * get all clients
     * @param req request object
     * @param res response object
     */
  static async handleGetAllClient(req: Request, res: Response) {
    try {
      const pageNum: number = Number(req.query.page) || 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const searchTerm: any = req.query.search || '.*';

      console.log('search', searchTerm);
  
      const servicePerPage: number = 9;
      const services = await Service.find({ serviceName: { $regex: searchTerm, $options: 'i' } });
  
      const startIndex = pageNum * servicePerPage;
      const endIndex = startIndex + servicePerPage;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const serviceList: any[] = services.slice(startIndex, endIndex).map((service) => service.toObject());

      console.log(services);

      res.status(200).json({
        message: 'Services fetched successfully',
        success: true,
        services: serviceList,
        hasMore: endIndex < services.length,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error', success: false });
    }
  }

  /**
     * get all clients
     * @param req request object
     * @param res response object
     */
  static async handleGetASingleService(req: Request, res: Response) {
    try{
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const serviceId: any = req.query.serviceId || '';

      const services = await Service.find({ _id: serviceId });

      res.status(200).json({
        message: 'Services fetched successfully',
        success: true,
        data: services,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error', success: false });
    }
  }

  /**
     * update the service status
     * @param req request object
     * @param res response object
     */
  static async handleServiceStatus(req: Request, res: Response) {
    try {
      const {id, status} = req.body;
      console.log('id', id);
      console.log('status', status);

      const updatedService = await Service.findByIdAndUpdate(id, { status }, { new: true });

      if (!updatedService) {
        return res.status(404).json({ message: 'Service not found', success: false });
      }

      res.status(200).json({ message: 'Service status updated successfully', success: true, updatedService });

    } catch (error) {
      res.status(500).json({ message: 'Internal server error', success: false });
    }
  }

  /**
     * Add a new Binnacle
     * @param req request object
     * @param res response object
     */
  static async handleAddNewBinnacle(req: Request, res: Response) {
    try {
      const {period, comment, serviceId} = req.body;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const file : any = req.file;

      if (!period || !comment || !serviceId || !file.path) {
        return res.json({ 
          message: 'All fields are required',
          success: false
        });
      }
      const service = await Service.findById(serviceId);

      if (!service) {
        return res.json({ 
          message: 'Service not found',
          success: false, 
        });
      }

      const blog = await Blog.create({
        serviceId,
        period,
        comment,
        files: file.path.split('/')[2],
      });

      const filePath = path.join('dist/public/Archive', service?.blogArchive ? service?.blogArchive : 'none.pdf');

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      const blogFiles = await Blog.find({ serviceId });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fileList: any = [];

      blogFiles.map((blog)=> {
        fileList.push(blog?.files);
      });

      const id = uuid4();
      const zipFileName = id + '.zip';
      const outputFilePath = path.join('dist/public/Archive', zipFileName);
      // Check if the target directory exists, create it if it doesn't
      if (!fs.existsSync('public/Archive')) {
        fs.mkdirSync('public/Archive', { recursive: true });
      }
      await Service.findOneAndUpdate(
        { _id: serviceId },
        {blogArchive: zipFileName},
        { new: true }
      );

      const output = fs.createWriteStream(outputFilePath);

      const archive = archiver('zip', {
        zlib: { level: 9 }
      });

      archive.pipe(output);
      const sourceDir = 'dist/public';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fileList.forEach((file: any) => {
        archive.append(fs.createReadStream(`${sourceDir}/${file}`), { name: file });
      });
      
      // Finalize the archive
      await archive.finalize();
      
      // Listen for archive completion
      await output.on('close', () => {
        console.log('Archive created successfully.');

        if (service.Notification){
          sendEmail(
            service.email,
            'New Binnacle document',
            {
              name: service.clientName,
              email: 'binnacle',
              password: undefined,
              link: `http://localhost:5173/${blog.files}`
            },
            './template/documentNotification.handlebars'
          );
        }
        return res.status(201).json({
          message: 'Bill created successfully',
          success: true,
          data: blog,
        });
      });
      
      // Listen for errors
      archive.on('error', err => {
        throw err;
      });
    } catch (error) {
      console.log(error); 
      res.status(500).json({ message: 'Internal server error', success: false });
    }
  }

  /**
     * Add a new Nurses
     * @param req request object
     * @param res response object
     */
  static async handleAddNewNurses(req: Request, res: Response) {
    try {
      const {format, Name, comment, serviceId} = req.body;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const file : any = req.file;

      if (!format || !Name || !comment || !serviceId || !file.path) {
        return res.json({ 
          message: 'All fields are required',
          success: false
        });
      }

      const service = await Service.findById(serviceId);

      if (!service) {
        return res.json({ 
          message: 'Service not found',
          success: false, 
        });
      }

      const nurse = await Nurse.create({
        serviceId,
        Name,
        Archive: Name + '.' + format.split('/')[1],
        comment,
        files: file.path.split('/')[2],
      });


      const filePath = path.join('dist/public/Archive', service?.nurseArchive ? service?.nurseArchive : 'none.pdf');

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      const nurseFiles = await Nurse.find({ serviceId });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fileList: any = [];

      nurseFiles.map((nurse)=> {
        fileList.push(nurse?.files);
      });

      const id = uuid4();
      const zipFileName = id + '.zip';
      const outputFilePath = path.join('dist/public/Archive', zipFileName);
      // Check if the target directory exists, create it if it doesn't
      if (!fs.existsSync('public/Archive')) {
        fs.mkdirSync('public/Archive', { recursive: true });
      }
      await Service.findOneAndUpdate(
        { _id: serviceId },
        { nurseArchive: zipFileName },
        { new: true }
      );

      const output = fs.createWriteStream(outputFilePath);

      const archive = archiver('zip', {
        zlib: { level: 9 }
      });

      archive.pipe(output);
      const sourceDir = 'dist/public';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fileList.forEach((file: any) => {
        archive.append(fs.createReadStream(`${sourceDir}/${file}`), { name: file });
      });
      
      // Finalize the archive
      await archive.finalize();
      
      // Listen for archive completion
      await output.on('close', () => {
        console.log('Archive created successfully.');

        if (service.Notification){
          sendEmail(
            service.email,
            'New nurse document',
            {
              name: service.clientName,
              email: 'nurse',
              password: undefined,
              link: `http://localhost:5173/${nurse.files}`
            },
            './template/documentNotification.handlebars'
          );
        }
        return res.status(201).json({
          message: 'Bill created successfully',
          success: true,
          data: nurse,
        });
      });
      
      // Listen for errors
      archive.on('error', err => {
        throw err;
      });

    } catch (error) {
      res.status(500).json({ message: 'Internal server error', success: false });
    }
  }

  /**
     * Add a new bill
     * @param req request object
     * @param res response object
     */
  static async handleAddNewBill(req: Request, res: Response) {
    try {
      const {period, comment, serviceId} = req.body;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const file : any = req.file;

      if (!period || !comment || !serviceId || !file.path) {
        return res.json({ 
          message: 'All fields are required',
          success: false
        });
      }
      const service = await Service.findById(serviceId);

      if (!service) {
        return res.json({ 
          message: 'Service not found',
          success: false, 
        });
      }

      const bill = await Bill.create({
        serviceId,
        period,
        comment,
        files: file.path.split('/')[2],
      });

      const filePath = path.join('dist/public/Archive', service?.nurseArchive ? service?.nurseArchive : 'none.pdf');

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      const billFiles = await Bill.find({ serviceId });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fileList: any = [];

      billFiles.map((bill)=> {
        fileList.push(bill?.files);
      });

      const id = uuid4();
      const zipFileName = id + '.zip';
      const outputFilePath = path.join('dist/public/Archive', zipFileName);
  
      await Service.findOneAndUpdate(
        { _id: serviceId },
        {billArchive: zipFileName},
        { new: true }
      );

      const output = fs.createWriteStream(outputFilePath);

      const archive = archiver('zip', {
        zlib: { level: 9 }
      });

      archive.pipe(output);
      const sourceDir = 'dist/public';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fileList.forEach((file: any) => {
        archive.append(fs.createReadStream(`${sourceDir}/${file}`), { name: file });
      });
      
      // Finalize the archive
      await archive.finalize();
      
      // Listen for archive completion
      await output.on('close', () => {
        console.log('Archive created successfully.');

        if (service.Notification){
          sendEmail(
            service.email,
            'New bill document',
            {
              name: service.clientName,
              email: 'bill',
              password: undefined,
              link: `http://localhost:5173/${bill.files}`
            },
            './template/documentNotification.handlebars'
          );
        }
        return res.status(201).json({
          message: 'Bill created successfully',
          success: true,
          data: bill,
        });
      });
      
      // Listen for errors
      archive.on('error', err => {
        throw err;
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', success: false });
    }
  }

  /**
     * Get all the bills
     * @param req request object
     * @param res response object
     */
  static async handleGetAllBill(req: Request, res: Response) {
    try {

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const searchTerm: any = req.query.search || '.*';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filter: any = req.query.filter === 'true';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const serviceId: any = req.query.serviceId;

      const bills = await Bill.find({ comment: { $regex: searchTerm, $options: 'i' }, serviceId });
  
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const billList: any[] = bills.map((bill) => bill.toObject());
      console.log('filter', filter);

      if (filter) {
        billList.sort((a, b) => new Date(a.fileDate).getTime() - new Date(b.fileDate).getTime());
      } else {
        billList.sort((a, b) => new Date(b.fileDate).getTime() - new Date(a.fileDate).getTime());
      }

      res.status(200).json({
        message: 'Bill fetched successfully',
        success: true,
        data: billList,
      });
      
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', success: false });
    }
  }

  /**
     * Get all the Blog
     * @param req request object
     * @param res response object
     */
  static async handleGetAllBinnacle(req: Request, res: Response) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const searchTerm: any = req.query.search || '.*';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filter: any = req.query.filter === 'true';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const serviceId: any = req.query.serviceId;

      const blogs = await Blog.find({ comment: { $regex: searchTerm, $options: 'i' }, serviceId });
  
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blogList: any[] = blogs.map((blog) => blog.toObject());

      if (filter) {
        blogList.sort((a, b) => new Date(a.fileDate).getTime() - new Date(b.fileDate).getTime());
      } else {
        blogList.sort((a, b) => new Date(b.fileDate).getTime() - new Date(a.fileDate).getTime());
      }

      res.status(200).json({
        message: 'Bill fetched successfully',
        success: true,
        data: blogList,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', success: false });
    }
  }

  /**
     * Get all the nurse
     * @param req request object
     * @param res response object
     */
  static async handleGetAllNurse(req: Request, res: Response) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const searchTerm: any = req.query.search || '.*';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filter: any = req.query.filter === 'true';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const serviceId: any = req.query.serviceId;

      const nurses = await Nurse.find({ comment: { $regex: searchTerm, $options: 'i' }, serviceId });
  
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nurseList: any[] = nurses.map((nurse) => nurse.toObject());

      if (filter) {
        nurseList.sort((a, b) => new Date(a.fileDate).getTime() - new Date(b.fileDate).getTime());
      } else {
        nurseList.sort((a, b) => new Date(b.fileDate).getTime() - new Date(a.fileDate).getTime());
      }

      res.status(200).json({
        message: 'Bill fetched successfully',
        success: true,
        data: nurseList,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', success: false });
    }
  }

  /**
     * update Bill
     * @param req request object
     * @param res response object
     */
  static async handleUpdateABill(req: Request, res: Response) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const {period, comment, serviceId}: any = req.body;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const file : any = req.file;

      if (!period || !comment || !serviceId || !file.path) {
        return res.json({ 
          message: 'All fields are required',
          success: false
        });
      }

      const bill = await Bill.findById(serviceId);

      const filePath = path.join(__dirname, 'public', bill?.files || '');

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('File removed successfully.');
      } else {
        console.log('File does not exist.');
      }

      const now = new Date();

      const updatedBill = await Bill.findOneAndUpdate(
        { _id: serviceId },
        { comment, period, files: file.path.split('/')[1], fileDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()) }, 
        { new: true }
      );

      if (!updatedBill) {
        return res.status(404).json({ message: 'Service not found', success: false });
      }

      const service = await Service.findById(serviceId);

      const updateFilePath = path.join('dist/public/Archive', service?.billArchive ? service?.billArchive : 'none.pdf');

      if (fs.existsSync(updateFilePath)) {
        fs.unlinkSync(updateFilePath);
      }

      const billFiles = await Bill.find({ serviceId });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fileList: any = [];

      billFiles.map((bill)=> {
        fileList.push(bill?.files);
      });

      const id = uuid4();
      const zipFileName = id + '.zip';
      const outputFilePath = path.join('dist/public/Archive', zipFileName);
      // Check if the target directory exists, create it if it doesn't
      if (!fs.existsSync('public/Archive')) {
        fs.mkdirSync('public/Archive', { recursive: true });
      }
      await Service.findOneAndUpdate(
        { _id: serviceId },
        {billArchive: zipFileName},
        { new: true }
      );

      const output = fs.createWriteStream(outputFilePath);

      const archive = archiver('zip', {
        zlib: { level: 9 }
      });

      archive.pipe(output);
      const sourceDir = 'dist/public';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fileList.forEach((file: any) => {
        archive.append(fs.createReadStream(`${sourceDir}/${file}`), { name: file });
      });
      
      // Finalize the archive
      await archive.finalize();
      
      // Listen for archive completion
      await output.on('close', () => {
        console.log('Archive created successfully.');
        res.status(200).json({ message: 'Service status updated successfully', success: true, data: updatedBill });
      });
      
      // Listen for errors
      archive.on('error', err => {
        throw err;
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', success: false });
    }
  }


  /**
     * update Binnacle
     * @param req request object
     * @param res response object
     */
  static async handleUpdateABinnacle(req: Request, res: Response) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const {period, comment, serviceId}: any = req.body;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const file : any = req.file;

      if (!period || !comment || !serviceId || !file.path) {
        return res.json({ 
          message: 'All fields are required',
          success: false
        });
      }

      const blog = await Blog.findById(serviceId);

      const filePath = path.join(__dirname, 'public', blog?.files || '');

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('File removed successfully.');
      } else {
        console.log('File does not exist.');
      }

      const now = new Date();

      const updatedBlog = await Blog.findOneAndUpdate(
        { _id: serviceId },
        { comment, period, files: file.path.split('/')[1], fileDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()) }, 
        { new: true }
      );

      if (!updatedBlog) {
        return res.status(404).json({ message: 'Service not found', success: false });
      }
      
      const service = await Service.findById(serviceId);

      const updateFilePath = path.join('dist/public/Archive', service?.blogArchive ? service?.blogArchive : 'none.pdf');

      if (fs.existsSync(updateFilePath)) {
        fs.unlinkSync(updateFilePath);
      }

      const blogFiles = await Blog.find({ serviceId });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fileList: any = [];

      blogFiles.map((blog)=> {
        fileList.push(blog?.files);
      });

      const id = uuid4();
      const zipFileName = id + '.zip';
      const outputFilePath = path.join('dist/public/Archive', zipFileName);
      // Check if the target directory exists, create it if it doesn't
      if (!fs.existsSync('public/Archive')) {
        fs.mkdirSync('public/Archive', { recursive: true });
      }
      await Service.findOneAndUpdate(
        { _id: serviceId },
        {blogArchive: zipFileName},
        { new: true }
      );

      const output = fs.createWriteStream(outputFilePath);

      const archive = archiver('zip', {
        zlib: { level: 9 }
      });

      archive.pipe(output);
      const sourceDir = 'dist/public';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fileList.forEach((file: any) => {
        archive.append(fs.createReadStream(`${sourceDir}/${file}`), { name: file });
      });
      
      // Finalize the archive
      await archive.finalize();
      
      // Listen for archive completion
      await output.on('close', () => {
        console.log('Archive created successfully.');
        res.status(200).json({ message: 'Service status updated successfully', success: true, data: updatedBlog });
      });
      
      // Listen for errors
      archive.on('error', err => {
        throw err;
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', success: false });
    }
  }

  /**
     * update nurse
     * @param req request object
     * @param res response object
     */
  static async handleUpdateANurse(req: Request, res: Response) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const {format, Name, comment, serviceId} = req.body;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const file : any = req.file;

      if (!format || !Name || !comment || !serviceId || !file.path) {
        return res.json({ 
          message: 'All fields are required',
          success: false
        });
      }

      const nurse = await Nurse.findById(serviceId);

      const filePath: string = path.join('dist/public', nurse?.files || '');

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('File removed successfully.');
      } else {
        console.log('File does not exist.');
      }

      const now = new Date();

      const updatedNurse = await Nurse.findOneAndUpdate(
        { _id: serviceId },
        { comment, Archive: Name + '.' + format.split('/')[1], Name, files: file.path.split('/')[2], fileDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()) }, 
        { new: true }
      );

      if (!updatedNurse) {
        return res.status(404).json({ message: 'Service not found', success: false });
      }

      const service = await Service.findById(serviceId);

      const updateFilePath = path.join('dist/public/Archive', service?.nurseArchive ? service?.nurseArchive : 'none.pdf');

      if (fs.existsSync(updateFilePath)) {
        fs.unlinkSync(updateFilePath);
      }

      const nurseFiles = await Nurse.find({ serviceId });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fileList: any = [];

      nurseFiles.map((nurse)=> {
        fileList.push(nurse?.files);
      });

      const id = uuid4();
      const zipFileName = id + '.zip';
      const outputFilePath = path.join('dist/public/Archive', zipFileName);
      // Check if the target directory exists, create it if it doesn't
      if (!fs.existsSync('public/Archive')) {
        fs.mkdirSync('public/Archive', { recursive: true });
      }
      await Service.findOneAndUpdate(
        { _id: serviceId },
        {nurseArchive: zipFileName},
        { new: true }
      );

      const output = fs.createWriteStream(outputFilePath);

      const archive = archiver('zip', {
        zlib: { level: 9 }
      });

      archive.pipe(output);
      const sourceDir = 'dist/public';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fileList.forEach((file: any) => {
        archive.append(fs.createReadStream(`${sourceDir}/${file}`), { name: file });
      });
      
      // Finalize the archive
      await archive.finalize();
      
      // Listen for archive completion
      await output.on('close', () => {
        console.log('Archive created successfully.');
        res.status(200).json({ message: 'Service status updated successfully', success: true, data: updatedNurse });
      });
      
      // Listen for errors
      archive.on('error', err => {
        throw err;
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', success: false });
    }
  }
}

export default adminController;