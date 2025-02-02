/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { Bill, Blog, Nurse, Service, User, Notification } from '../../database';
import {sendEmail } from '../../utils';
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
  static async handleAddClient(req: Request, res: Response, next: NextFunction){
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
        
        // const salt = await bcrypt.genSalt();
        // const password = Math.random().toString(36).slice(2, 10);
        // const passwordHash = await bcrypt.hash(password, salt);

        const passwordHash = '$2a$12$.ArXjrJfflaVoa22wjPUVO4ID/Fi7T8Uvqo9c9Z/jHpMps0EgaLOy';

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


        // const link = await generateResetToken(client?._id); 

        // await sendEmail(
        //   client.email,
        //   'Atend - Bienvenido a tu portal de documentos',
        //   {
        //     name: client.Name,
        //     serviceName: undefined,
        //     email: client.email,
        //     password: 'Atend2025',
        //     link,
        //   },
        //   './template/newClient.handlebars'
        // );
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
          clientName: Name,
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
      next(err);
    }
  }

  /**
     * get all clients
     * @param req request object
     * @param res response object
     */
  static async handleGetAllClient(req: Request, res: Response, next: NextFunction) {
    try {
      const pageNum: number = Number(req.query.page) || 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const searchTerm: any = req.query.search || '.*';
      const bar: any = req.query.bar || 'client';
  
      const servicePerPage: number = 9;

      const query: any = {
        $or: [
          { email: { $regex: searchTerm, $options: 'i' } },
          { serviceName: { $regex: searchTerm, $options: 'i' } }, 
          { clientName: { $regex: searchTerm, $options: 'i' } }
        ]
      };

      // Determine sorting field
      const sortField = bar === 'client' ? 'clientName' : bar === 'service' ? 'serviceName' : 'email';

      const services = await Service.find(query).sort({ [sortField]: 1 });
  
      const startIndex = pageNum * servicePerPage;
      const endIndex = startIndex + servicePerPage;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const serviceList: any[] = services.slice(startIndex, endIndex).map((service) => service.toObject());

      res.status(200).json({
        message: 'Services fetched successfully',
        success: true,
        services: serviceList,
        hasMore: endIndex < services.length,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
     * get all clients
     * @param req request object
     * @param res response object
     */
  static async handleGetASingleService(req: Request, res: Response, next: NextFunction) {
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
      next(err);
    }
  }

  /**
     * update the service status
     * @param req request object
     * @param res response object
     */
  static async handleServiceStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const {id, status} = req.body;

      const updatedService = await Service.findByIdAndUpdate(id, { status }, { new: true });

      if (!updatedService) {
        return res.status(404).json({ message: 'Service not found', success: false });
      }

      res.status(200).json({ message: 'Service status updated successfully', success: true, updatedService });

    } catch (error) {
      next(error);
    }
  }

  /**
     * Add a new Binnacle
     * @param req request object
     * @param res response object
     */
  static async handleAddNewBinnacle(req: Request, res: Response, next: NextFunction) {
    try {
      const {period, Name, comment, serviceId} = req.body;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const file : any = req.file;

      console.log(file);
      console.log('file in add new binnacle', file.path);

      if (!period || !Name || !serviceId || !file || !file.path) {
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
        Name,
        comment: comment || '',
        files: file.path,
      });

      await Notification.create({
        clientId: service.clientId,
        serviceId,
        link1: `${blog.files}`,
        type: 'binnacle',
        read: false,
      });
      
      const filePath = path.join('public/Archive', service?.blogArchive ? service?.blogArchive : 'none.pdf' );

      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (!err) {
          fs.unlinkSync(filePath);
        }
      });
      const blogFiles = await Blog.find({ serviceId });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fileList: any = [];

      blogFiles.map((blog)=> {
        fileList.push(blog?.files.split('/')[1]);
      });

      const id = uuid4();
      const zipFileName = id + '.zip';
      const outputFilePath = path.join('public/Archive', zipFileName);

      await Service.findOneAndUpdate(
        { _id: serviceId },
        {blogArchive: zipFileName},
        { new: true }
      );

      const output = fs.createWriteStream(outputFilePath);
      output.on('error', (err) => {
        console.error('Error creating archive:', err);
        if (!res.headersSent) {
          return next(err);
        }
      });

      const archive = archiver('zip', {
        zlib: { level: 9 }
      });

      archive.pipe(output);
      const sourceDir = 'public';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fileList.forEach((file: any) => {
        const fullPath = path.join(sourceDir, file);
        if (fs.existsSync(fullPath)) {
          const fileStream = fs.createReadStream(fullPath);
          fileStream.on('error', (err) => {
            console.error('Error reading file:', err);
            if (!res.headersSent) {
              return next(err);
            }
          });
          archive.append(fileStream, { name: file });
        } else {
          console.error('File not found:', fullPath);
        }
      });
      
      // Finalize the archive
      await archive.finalize();
      
      // Listen for archive completion
      await output.on('close', () => {

        if (service.Notification){
          sendEmail(
            service.email,
            'Atend - Nueva bitácora cargada',
            {
              name: service.clientName,
              serviceName: service.serviceName,
              email: 'binnacle',
              password: undefined,
              link: `https://clientes.atend.mx/${blog.files}`
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
      archive.on('error', (err) => {
        if (!res.headersSent) {
          return next(err);
        }
      });

    } catch (error) {
      console.error('Catch block error:', error);
      if (!res.headersSent) {
        return next(error);
      }
    }
  }

  /**
     * Add a new Nurses
     * @param req request object
     * @param res response object
     */
  static async handleAddNewNurses(req: Request, res: Response, next: NextFunction) {
    try {
      const {format, Name, comment, serviceId} = req.body;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const file : any = req.file;

      console.log(file);
      console.log('file in add new nurse', file.path);

      if (!format || !Name || !serviceId || !file || !file.path) {
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
        Archive: Name + '.' + format.split('.')[1],
        comment: comment || '',
        files: file.path,
      });


      await Notification.create({
        clientId: service.clientId,
        serviceId,
        link1: `${nurse.files}`,
        type: 'nurse',
        read: false,
      });

      const filePath = path.join('public/Archive', service?.nurseArchive ? service?.nurseArchive : 'none.pdf');
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (!err) {
          fs.unlinkSync(filePath);
        }
      });

      const nurseFiles = await Nurse.find({ serviceId });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fileList: any = [];

      nurseFiles.map((nurse)=> {
        fileList.push(nurse?.files.split('/')[1]);
      });

      const id = uuid4();
      const zipFileName = id + '.zip';
      const outputFilePath = path.join('public/Archive', zipFileName);
      
      await Service.findOneAndUpdate(
        { _id: serviceId },
        { nurseArchive: zipFileName },
        { new: true }
      );

      const output = fs.createWriteStream(outputFilePath);
      output.on('error', (err) => {
        console.error('Error creating archive:', err);
        if (!res.headersSent) {
          return next(err);
        }
      });

      const archive = archiver('zip', {
        zlib: { level: 9 }
      });

      archive.pipe(output);
      const sourceDir = 'public';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fileList.forEach((file: any) => {
        const fullPath = path.join(sourceDir, file);
        if (fs.existsSync(fullPath)) {
          const fileStream = fs.createReadStream(fullPath);
          fileStream.on('error', (err) => {
            console.error('Error reading file:', err);
            if (!res.headersSent) {
              return next(err);
            }
          });
          archive.append(fileStream, { name: file });
        } else {
          console.error('File not found:', fullPath);
        }
      });
      
      // Finalize the archive
      await archive.finalize();
      
      // Listen for archive completion
      await output.on('close', () => {

        if (service.Notification){
          sendEmail(
            service.email,
            'Atend - Nueva factura cargada',
            {
              name: service.clientName,
              serviceName: service.serviceName,
              email: 'nurse',
              password: undefined,
              link: `https://clientes.atend.mx/${nurse.files}`
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
        if (!res.headersSent) {
          return next(err);
        }
      });

    } catch (error) {
      console.error('Catch block error:', error);
      if (!res.headersSent) {
        return next(error);
      }
    }
  }

  /**
     * Add a new bill
     * @param req request object
     * @param res response object
     */
  static async handleAddNewBill(req: Request, res: Response, next: NextFunction) {
    try {
      const {period, Name, comment, serviceId} = req.body;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const file : any = req.files;

      console.log(file);
      console.log('file in add new nurse', file.path);
      
      if (!period || !Name || !serviceId || !file || !file[0] || !file[1] || !file[0].path || !file[1].path) {
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

      console.log(file);

      
      const bill = await Bill.create({
        serviceId,
        period,
        Name,
        comment: comment || '',
        file1: file[0].path,
        file2: file[1].path,
      });

      await Notification.create({
        clientId: service.clientId,
        serviceId,
        link1: `${bill.file1}`,
        link2: `${bill.file2}`,
        type: 'bill',
        read: false,
      });

      const filePath = path.join('public/Archive', service?.billArchive ? service?.billArchive : 'none.pdf');
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (!err) {
          fs.unlinkSync(filePath);
        }
      });
      const billFiles = await Bill.find({ serviceId });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fileList: any = [];

      billFiles.map((bill)=> {
        fileList.push(bill?.file1.split('/')[1]);
        fileList.push(bill?.file2.split('/')[1]);
      });

      const id = uuid4();
      const zipFileName = id + '.zip';
      const outputFilePath = path.join('public/Archive', zipFileName);
  
      await Service.findOneAndUpdate(
        { _id: serviceId },
        {billArchive: zipFileName},
        { new: true }
      );

      const output = fs.createWriteStream(outputFilePath);
      output.on('error', (err) => {
        console.error('Error creating archive:', err);
        if (!res.headersSent) {
          return next(err);
        }
      });

      const archive = archiver('zip', {
        zlib: { level: 9 }
      });

      archive.pipe(output);
      const sourceDir = 'public';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fileList.forEach((file: any) => {
        const fullPath = path.join(sourceDir, file);
        if (fs.existsSync(fullPath)) {
          const fileStream = fs.createReadStream(fullPath);
          fileStream.on('error', (err) => {
            console.error('Error reading file:', err);
            if (!res.headersSent) {
              return next(err);
            }
          });
          archive.append(fileStream, { name: file });
        } else {
          console.error('File not found:', fullPath);
        }
      });
      
      // Finalize the archive
      await archive.finalize();
      
      // Listen for archive completion
      await output.on('close', () => {

        if (service.Notification){
          sendEmail(
            service.email,
            'Atend - Nueva factura cargada',
            {
              name: service.clientName,
              serviceName: service.serviceName,
              email: 'bill',
              password: undefined,
              link: `https://clientes.atend.mx/${bill.file1}`
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
        if (!res.headersSent) {
          return next(err);
        }
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Catch block error:', error);
      if (!res.headersSent) {
        return next(error);
      }
    }
  }

  /**
     * Get all the bills
     * @param req request object
     * @param res response object
     */
  static async handleGetAllBill(req: Request, res: Response, next: NextFunction) {
    try {

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const searchTerm: any = req.query.search || '.*';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filter: any = req.query.filter === 'true';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const serviceId: any = req.query.serviceId;

      const bills = await Bill.find({ Name: { $regex: searchTerm, $options: 'i' }, serviceId });
  
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const billList: any[] = bills.map((bill) => bill.toObject());

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
      next(error);
    }
  }

  /**
     * Get all the Blog
     * @param req request object
     * @param res response object
     */
  static async handleGetAllBinnacle(req: Request, res: Response, next: NextFunction) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const searchTerm: any = req.query.search || '.*';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filter: any = req.query.filter === 'true';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const serviceId: any = req.query.serviceId;

      const blogs = await Blog.find({ Name: { $regex: searchTerm, $options: 'i' }, serviceId });
  
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
      next(error);
    }
  }

  /**
     * Get all the nurse
     * @param req request object
     * @param res response object
     */
  static async handleGetAllNurse(req: Request, res: Response, next: NextFunction) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const searchTerm: any = req.query.search || '.*';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filter: any = req.query.filter === 'true';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const serviceId: any = req.query.serviceId;

      const nurses = await Nurse.find({ Name: { $regex: searchTerm, $options: 'i' }, serviceId });
  
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
      next(error);
    }
  }

  /**
     * update Bill
     * @param req request object
     * @param res response object
     */
  static async handleUpdateABill(req: Request, res: Response, next: NextFunction) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const {period, Name, comment, serviceId}: any = req.body;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const file : any = req.files;
      

      if (!period || !Name || !serviceId || !file[0].path || !file[1].path) {
        return res.json({ 
          message: 'All fields are required',
          success: false
        });
      }

      const bill: any = await Bill.findById(serviceId);

      if(bill?.file1 !== '' || bill?.file1){
        const filePath = path.join('public', bill?.file1.split('/')[1]);
        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlinkSync(filePath);
          }
        });
      }

      if(bill?.file2 !== '' || bill?.file2){
        const filePath = path.join('public', bill?.file2.split('/')[1]);
        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlinkSync(filePath);
          }
        });
      }

      const now = new Date();

      const updatedBill = await Bill.findOneAndUpdate(
        { _id: serviceId },
        { comment: comment || '', Name ,period, file1: file[0].path, file2: file[1].path, fileDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()) }, 
        { new: true }
      );

      if (!updatedBill) {
        return res.status(404).json({ message: 'Service not found', success: false });
      }

      const service: any = await Service.findById(serviceId);

      await Notification.create({
        clientId: service.clientId,
        serviceId,
        link1: `${bill?.file1}`,
        link2: `${bill?.file2}`,
        type: 'bill',
        read: false,
      });

      if(service?.billArchive !== '' || service?.billArchive){
        const filePath = path.join('public/Archive', service?.billArchive);
        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlinkSync(filePath);
          }
        });
      }

      const billFiles = await Bill.find({ serviceId });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fileList: any = [];

      billFiles.map((bill)=> {
        fileList.push(bill?.file1.split('/')[1]);
        fileList.push(bill?.file2.split('/')[1]);
      });

      const id = uuid4();
      const zipFileName = id + '.zip';
      const outputFilePath = path.join('public/Archive', zipFileName);
      
      await Service.findOneAndUpdate(
        { _id: serviceId },
        {billArchive: zipFileName},
        { new: true }
      );

      const output = fs.createWriteStream(outputFilePath);
      output.on('error', (err) => {
        console.error('Error creating archive:', err);
        if (!res.headersSent) {
          return next(err);
        }
      });

      const archive = archiver('zip', {
        zlib: { level: 9 }
      });

      archive.pipe(output);
      const sourceDir = 'public';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fileList.forEach((file: any) => {
        const fullPath = path.join(sourceDir, file);
        if (fs.existsSync(fullPath)) {
          const fileStream = fs.createReadStream(fullPath);
          fileStream.on('error', (err) => {
            console.error('Error reading file:', err);
            if (!res.headersSent) {
              return next(err);
            }
          });
          archive.append(fileStream, { name: file });
        } else {
          console.error('File not found:', fullPath);
        }
      });
      
      // Finalize the archive
      await archive.finalize();
      
      // Listen for archive completion
      await output.on('close', () => {
        res.status(200).json({ message: 'Service status updated successfully', success: true, data: updatedBill });
      });
      
      // Listen for errors
      archive.on('error', err => {
        if (!res.headersSent) {
          return next(err);
        }
      });
    } catch (error) {
      if (!res.headersSent) {
        return next(error);
      }
    }
  }


  /**
     * update Binnacle
     * @param req request object
     * @param res response object
     */
  static async handleUpdateABinnacle(req: Request, res: Response, next: NextFunction) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const {period, Name, comment, serviceId}: any = req.body;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const file : any = req.file;

      if (!period || !Name || !serviceId || !file.path) {
        return res.json({ 
          message: 'All fields are required',
          success: false
        });
      }

      const blog: any = await Blog.findById(serviceId);

      if(blog?.files !== '' || blog?.files){
        const filePath = path.join('public', blog?.files.split('/')[1]);
        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlinkSync(filePath);
          }
        });
      }

      const now = new Date();

      const updatedBlog = await Blog.findOneAndUpdate(
        { _id: serviceId },
        { comment: comment || '', Name, period, files: file.path, fileDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()) }, 
        { new: true }
      );

      if (!updatedBlog) {
        return res.status(404).json({ message: 'Service not found', success: false });
      }
      
      const service: any = await Service.findById(serviceId);

      await Notification.create({
        clientId: service.clientId,
        serviceId,
        link1: `${blog?.files}`,
        type: 'binnacle',
        read: false,
      });

      if(service?.blogArchive !== '' || service?.blogArchive){
        const filePath = path.join('public/Archive', service?.blogArchive);
        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlinkSync(filePath);
          }
        });
      }

      const blogFiles = await Blog.find({ serviceId });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fileList: any = [];

      blogFiles.map((blog)=> {
        fileList.push(blog?.files.split('/')[1]);
      });

      const id = uuid4();
      const zipFileName = id + '.zip';
      const outputFilePath = path.join('public/Archive', zipFileName);
      
      await Service.findOneAndUpdate(
        { _id: serviceId },
        {blogArchive: zipFileName},
        { new: true }
      );

      const output = fs.createWriteStream(outputFilePath);
      output.on('error', (err) => {
        console.error('Error creating archive:', err);
        if (!res.headersSent) {
          return next(err);
        }
      });

      const archive = archiver('zip', {
        zlib: { level: 9 }
      });

      archive.pipe(output);
      const sourceDir = 'public';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fileList.forEach((file: any) => {
        const fullPath = path.join(sourceDir, file);
        if (fs.existsSync(fullPath)) {
          const fileStream = fs.createReadStream(fullPath);
          fileStream.on('error', (err) => {
            console.error('Error reading file:', err);
            if (!res.headersSent) {
              return next(err);
            }
          });
          archive.append(fileStream, { name: file });
        } else {
          console.error('File not found:', fullPath);
        }
      });
      
      // Finalize the archive
      await archive.finalize();
      
      // Listen for archive completion
      await output.on('close', () => {
        res.status(200).json({ message: 'Service status updated successfully', success: true, data: updatedBlog });
      });
      
      // Listen for errors
      archive.on('error', err => {
        if (!res.headersSent) {
          return next(err);
        }
      });
    } catch (error) {
      if (!res.headersSent) {
        return next(error);
      }
    }
  }

  /**
     * update nurse
     * @param req request object
     * @param res response object
     */
  static async handleUpdateANurse(req: Request, res: Response, next: NextFunction) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const {format, Name, comment, serviceId} = req.body;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const file : any = req.file;

      if (!format || !Name || !serviceId || !file.path) {
        return res.json({ 
          message: 'All fields are required',
          success: false
        });
      }

      const nurse: any = await Nurse.findById(serviceId);

      if(nurse?.files !== '' || nurse?.files){
        const filePath = path.join('public', nurse?.files.split('/')[1]);
        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlinkSync(filePath);
          }
        });
      }

      const now = new Date();

      const updatedNurse = await Nurse.findOneAndUpdate(
        { _id: serviceId },
        { comment: comment || '', Archive: Name + '.' + format.split('.')[1], Name, files: file.path, fileDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()) }, 
        { new: true }
      );

      if (!updatedNurse) {
        return res.status(404).json({ message: 'Service not found', success: false });
      }

      const service: any = await Service.findById(serviceId);

      await Notification.create({
        clientId: service.clientId,
        serviceId,
        link1: `${nurse?.files}`,
        type: 'nurse',
        read: false,
      });
      
      if(service?.nurseArchive  !== '' || service?.nurseArchive ){
        const filePath = path.join('public/Archive', service?.nurseArchive );
        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlinkSync(filePath);
          }
        });
      }

      const nurseFiles = await Nurse.find({ serviceId });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fileList: any = [];

      nurseFiles.map((nurse)=> {
        fileList.push(nurse?.files.split('/')[1]);
      });

      const id = uuid4();
      const zipFileName = id + '.zip';
      const outputFilePath = path.join('public/Archive', zipFileName);
      
      await Service.findOneAndUpdate(
        { _id: serviceId },
        {nurseArchive: zipFileName},
        { new: true }
      );

      const output = fs.createWriteStream(outputFilePath);
      output.on('error', (err) => {
        console.error('Error creating archive:', err);
        if (!res.headersSent) {
          return next(err);
        }
      });

      const archive = archiver('zip', {
        zlib: { level: 9 }
      });

      archive.pipe(output);
      const sourceDir = 'public';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fileList.forEach((file: any) => {
        const fullPath = path.join(sourceDir, file);
        if (fs.existsSync(fullPath)) {
          const fileStream = fs.createReadStream(fullPath);
          fileStream.on('error', (err) => {
            console.error('Error reading file:', err);
            if (!res.headersSent) {
              return next(err);
            }
          });
          archive.append(fileStream, { name: file });
        } else {
          console.error('File not found:', fullPath);
        }
      });
      
      // Finalize the archive
      await archive.finalize();
      
      // Listen for archive completion
      await output.on('close', () => {
        res.status(200).json({ message: 'Service status updated successfully', success: true, data: updatedNurse });
      });
      
      // Listen for errors
      archive.on('error', err => {
        if (!res.headersSent) {
          return next(err);
        }
      });
    } catch (error: any) {
      if (!res.headersSent) {
        return next(error);
      }
    }
  }

  /**
   * Delete a bill
   * @param req request object
   * @param res response object
   */
  static async handleDeleteBill(req: Request, res: Response, next: NextFunction){
    try {
      const { id } = req.params;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user: any = await Bill.findById(id);

      if(user?.file1 !== '' || user?.file1){
        const updateFilePath = path.join('public', user?.file1.split('/')[1]);
        fs.access(updateFilePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlinkSync(updateFilePath);
          }
        });
      }

      if(user?.file2 !== '' || user?.file2){
        const updateFilePath = path.join('public', user?.file2.split('/')[1]);
        fs.access(updateFilePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlinkSync(updateFilePath);
          }
        });
      }

      const result = await Bill.findByIdAndDelete(id);
      if(!result) {
        return res.status(404).json({message: 'Bill not found'});
      }

      const service: any = await Service.findById(user?.serviceId);

      const updateFilePath = path.join('public/Archive', service?.billArchive);
      fs.access(updateFilePath, fs.constants.F_OK, (err) => {
        if (!err) {
          fs.unlinkSync(updateFilePath);
        }
      });

      const billFiles = await Bill.find({ serviceId: user?.serviceId });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fileList: any = [];

      billFiles.map((bill)=> {
        fileList.push(bill?.file1.split('/')[1]);
        fileList.push(bill?.file2.split('/')[1]);
      });

      const uid = uuid4();
      const zipFileName = uid + '.zip';
      const outputFilePath = path.join('public/Archive', zipFileName);
      
      await Service.findOneAndUpdate(
        { _id: user?.serviceId },
        {billArchive: zipFileName},
        { new: true }
      );

      const output = fs.createWriteStream(outputFilePath);
      output.on('error', (err) => {
        console.error('Error creating archive:', err);
        if (!res.headersSent) {
          return next(err);
        }
      });

      const archive = archiver('zip', {
        zlib: { level: 9 }
      });

      archive.pipe(output);
      const sourceDir = 'public';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fileList.forEach((file: any) => {
        const fullPath = path.join(sourceDir, file);
        if (fs.existsSync(fullPath)) {
          const fileStream = fs.createReadStream(fullPath);
          fileStream.on('error', (err) => {
            console.error('Error reading file:', err);
            if (!res.headersSent) {
              return next(err);
            }
          });
          archive.append(fileStream, { name: file });
        } else {
          console.error('File not found:', fullPath);
        }
      });
      
      // Finalize the archive
      await archive.finalize();
      
      // Listen for archive completion
      await output.on('close', () => {
        return res.status(200).send({message: 'Bill deleted successfully'});
      });
      
      // Listen for errors
      archive.on('error', err => {
        if (!res.headersSent) {
          return next(err);
        }
      });
    } catch (error) {
      if (!res.headersSent) {
        return next(error);
      }
    }
  }

  /**
   * Delete a binnacle
   * @param req request object
   * @param res response object
   */
  static async handleDeleteBinnacle(req: Request, res: Response, next: NextFunction){
    try {
      const { id } = req.params;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user: any = await Blog.findById(id);

      if(user?.files !== '' || user?.files){
        const updateFilePath = path.join('public', user?.files.split('/')[1]);
        fs.access(updateFilePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlinkSync(updateFilePath);
          }
        });
      }

      const result = await Blog.findByIdAndDelete(id);
      if(!result) {
        return res.status(404).json({message: 'Binnacle not found'});
      }

      const service: any = await Service.findById(user?.serviceId);

      const updateFilePath = path.join('public/Archive', service?.blogArchive);
      fs.access(updateFilePath, fs.constants.F_OK, (err) => {
        if (!err) {
          fs.unlinkSync(updateFilePath);
        }
      });

      const blogFiles = await Blog.find({ serviceId: user?.serviceId });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fileList: any = [];

      blogFiles.map((blog)=> {
        fileList.push(blog?.files.split('/')[1]);
      });

      const uid = uuid4();
      const zipFileName = uid + '.zip';
      const outputFilePath = path.join('public/Archive', zipFileName);
      
      await Service.findOneAndUpdate(
        { _id: user?.serviceId },
        { blogArchive: zipFileName},
        { new: true }
      );

      const output = fs.createWriteStream(outputFilePath);
      output.on('error', (err) => {
        console.error('Error creating archive:', err);
        if (!res.headersSent) {
          return next(err);
        }
      });

      const archive = archiver('zip', {
        zlib: { level: 9 }
      });

      archive.pipe(output);
      const sourceDir = 'public';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fileList.forEach((file: any) => {
        const fullPath = path.join(sourceDir, file);
        if (fs.existsSync(fullPath)) {
          const fileStream = fs.createReadStream(fullPath);
          fileStream.on('error', (err) => {
            console.error('Error reading file:', err);
            if (!res.headersSent) {
              return next(err);
            }
          });
          archive.append(fileStream, { name: file });
        } else {
          console.error('File not found:', fullPath);
        }
      });
      
      // Finalize the archive
      await archive.finalize();
      
      // Listen for archive completion
      await output.on('close', () => {
        return res.status(200).send({message: 'Binnacle deleted successfully'});
      });
      
      // Listen for errors
      archive.on('error', err => {
        if (!res.headersSent) {
          return next(err);
        }
      });
    } catch (error) {
      if (!res.headersSent) {
        return next(error);
      }
    }
  }

  /**
   * Delete a nurse
   * @param req request object
   * @param res response object
   */
  static async handleDeleteNurse(req: Request, res: Response, next: NextFunction){
    try {
      const { id } = req.params;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user: any = await Nurse.findById(id);

      if(user?.files !== '' || user?.files){
        const updateFilePath = path.join('public', user?.files.split('/')[1]);
        fs.access(updateFilePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlinkSync(updateFilePath);
          }
        });
      }

      const result = await Nurse.findByIdAndDelete(id);
      if(!result) {
        return res.status(404).json({message: 'Nurse not found'});
      }

      const service: any = await Service.findById(user?.serviceId);

      const updateFilePath = path.join('public/Archive', service?.nurseArchive);
      fs.access(updateFilePath, fs.constants.F_OK, (err) => {
        if (!err) {
          fs.unlinkSync(updateFilePath);
        }
      });

      const nurseFiles = await Nurse.find({ serviceId: user?.serviceId });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fileList: any = [];

      nurseFiles.map((nurse)=> {
        fileList.push(nurse?.files.split('/')[1]);
      });

      const uid = uuid4();
      const zipFileName = uid + '.zip';
      const outputFilePath = path.join('public/Archive', zipFileName);
      
      await Service.findOneAndUpdate(
        { _id: user?.serviceId },
        { nurseArchive: zipFileName},
        { new: true }
      );

      const output = fs.createWriteStream(outputFilePath);
      output.on('error', (err) => {
        console.error('Error creating archive:', err);
        if (!res.headersSent) {
          return next(err);
        }
      });

      const archive = archiver('zip', {
        zlib: { level: 9 }
      });

      archive.pipe(output);
      const sourceDir = 'public';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fileList.forEach((file: any) => {
        const fullPath = path.join(sourceDir, file);
        if (fs.existsSync(fullPath)) {
          const fileStream = fs.createReadStream(fullPath);
          fileStream.on('error', (err) => {
            console.error('Error reading file:', err);
            if (!res.headersSent) {
              return next(err);
            }
          });
          archive.append(fileStream, { name: file });
        } else {
          console.error('File not found:', fullPath);
        }
      });
      
      // Finalize the archive
      await archive.finalize();
      
      // Listen for archive completion
      await output.on('close', () => {
        return res.status(200).send({message: 'Nurse deleted successfully'});
      });
      
      // Listen for errors
      archive.on('error', err => {
        if (!res.headersSent) {
          return next(err);
        }
      });
    } catch (error) {
      if (!res.headersSent) {
        return next(error);
      }
    }
  }
}

export default adminController;