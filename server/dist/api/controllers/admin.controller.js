"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../../database");
const utils_1 = require("../../utils");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const archiver_1 = __importDefault(require("archiver"));
const uuid4_1 = __importDefault(require("uuid4"));
/* Represent a run time controller*/
class adminController {
    /**
     * add a new client
     * @param req request object
     * @param res response object
     */
    static handleAddClient(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { Name, status, ServiceData, email, Notification } = req.body;
                if (!email || !Name || !status || !ServiceData) {
                    return res.json({
                        message: 'All fields are required',
                        success: false
                    });
                }
                const existingUser = yield database_1.User.findOne({ email });
                if (status == 'new') {
                    if (existingUser) {
                        return res.json({
                            message: 'Client already exists',
                            success: false,
                        });
                    }
                    const salt = yield bcrypt_1.default.genSalt();
                    const password = Math.random().toString(36).slice(2, 10);
                    const passwordHash = yield bcrypt_1.default.hash(password, salt);
                    const client = yield database_1.User.create({
                        Name,
                        email,
                        password: passwordHash,
                        type: 'client',
                        firstService: {},
                    });
                    const service = yield database_1.Service.create({
                        clientId: client._id,
                        clientName: client.Name,
                        serviceName: ServiceData,
                        email: client.email,
                        status: true,
                        Notification: Notification || false,
                    });
                    yield database_1.User.findOneAndUpdate({ _id: client._id }, { firstService: {
                            serviceId: service._id,
                            serviceName: service.serviceName,
                            clientName: service.clientName,
                        } }, { new: true });
                    // const link = await generateResetToken(client?._id); 
                    // await sendEmail(
                    //   client.email,
                    //   'Atend - Bienvenido a tu portal de documentos',
                    //   {
                    //     name: client.Name,
                    //     serviceName: undefined,
                    //     email: client.email,
                    //     password,
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
                }
                else {
                    if (!existingUser) {
                        return res.json({
                            message: 'Client does not exists',
                            success: false,
                        });
                    }
                    yield database_1.User.findByIdAndUpdate(existingUser._id, { ServiceNumber: existingUser.ServiceNumber + 1 }, { new: true });
                    const service = yield database_1.Service.create({
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
            }
            catch (err) {
                next(err);
            }
        });
    }
    /**
       * get all clients
       * @param req request object
       * @param res response object
       */
    static handleGetAllClient(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageNum = Number(req.query.page) || 0;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const searchTerm = req.query.search || '.*';
                const servicePerPage = 9;
                const services = yield database_1.Service.find({ email: { $regex: searchTerm, $options: 'i' } });
                const startIndex = pageNum * servicePerPage;
                const endIndex = startIndex + servicePerPage;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const serviceList = services.slice(startIndex, endIndex).map((service) => service.toObject());
                res.status(200).json({
                    message: 'Services fetched successfully',
                    success: true,
                    services: serviceList,
                    hasMore: endIndex < services.length,
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    /**
       * get all clients
       * @param req request object
       * @param res response object
       */
    static handleGetASingleService(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const serviceId = req.query.serviceId || '';
                const services = yield database_1.Service.find({ _id: serviceId });
                res.status(200).json({
                    message: 'Services fetched successfully',
                    success: true,
                    data: services,
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    /**
       * update the service status
       * @param req request object
       * @param res response object
       */
    static handleServiceStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, status } = req.body;
                const updatedService = yield database_1.Service.findByIdAndUpdate(id, { status }, { new: true });
                if (!updatedService) {
                    return res.status(404).json({ message: 'Service not found', success: false });
                }
                res.status(200).json({ message: 'Service status updated successfully', success: true, updatedService });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
       * Add a new Binnacle
       * @param req request object
       * @param res response object
       */
    static handleAddNewBinnacle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { period, Name, comment, serviceId } = req.body;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const file = req.file;
                console.log(file);
                console.log('file in add new binnacle', file.path);
                if (!period || !Name || !serviceId || !file || !file.path) {
                    return res.json({
                        message: 'All fields are required',
                        success: false
                    });
                }
                const service = yield database_1.Service.findById(serviceId);
                if (!service) {
                    return res.json({
                        message: 'Service not found',
                        success: false,
                    });
                }
                const blog = yield database_1.Blog.create({
                    serviceId,
                    period,
                    Name,
                    comment: comment || '',
                    files: file.path,
                });
                yield database_1.Notification.create({
                    clientId: service.clientId,
                    serviceId,
                    link1: `${blog.files}`,
                    type: 'binnacle',
                    read: false,
                });
                const filePath = path_1.default.join('public/Archive', (service === null || service === void 0 ? void 0 : service.blogArchive) ? service === null || service === void 0 ? void 0 : service.blogArchive : 'none.pdf');
                fs_1.default.access(filePath, fs_1.default.constants.F_OK, (err) => {
                    if (!err) {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
                const blogFiles = yield database_1.Blog.find({ serviceId });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const fileList = [];
                blogFiles.map((blog) => {
                    fileList.push(blog === null || blog === void 0 ? void 0 : blog.files.split('/')[1]);
                });
                const id = (0, uuid4_1.default)();
                const zipFileName = id + '.zip';
                const outputFilePath = path_1.default.join('public/Archive', zipFileName);
                yield database_1.Service.findOneAndUpdate({ _id: serviceId }, { blogArchive: zipFileName }, { new: true });
                const output = fs_1.default.createWriteStream(outputFilePath);
                output.on('error', (err) => {
                    console.error('Error creating archive:', err);
                    if (!res.headersSent) {
                        return next(err);
                    }
                });
                const archive = (0, archiver_1.default)('zip', {
                    zlib: { level: 9 }
                });
                archive.pipe(output);
                const sourceDir = 'public';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                fileList.forEach((file) => {
                    const fullPath = path_1.default.join(sourceDir, file);
                    if (fs_1.default.existsSync(fullPath)) {
                        const fileStream = fs_1.default.createReadStream(fullPath);
                        fileStream.on('error', (err) => {
                            console.error('Error reading file:', err);
                            if (!res.headersSent) {
                                return next(err);
                            }
                        });
                        archive.append(fileStream, { name: file });
                    }
                    else {
                        console.error('File not found:', fullPath);
                    }
                });
                // Finalize the archive
                yield archive.finalize();
                // Listen for archive completion
                yield output.on('close', () => {
                    if (service.Notification) {
                        (0, utils_1.sendEmail)(service.email, 'Atend - Nueva bitácora cargada', {
                            name: service.clientName,
                            serviceName: service.serviceName,
                            email: 'binnacle',
                            password: undefined,
                            link: `https://clientes.atend.mx/${blog.files}`
                        }, './template/documentNotification.handlebars');
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
            }
            catch (error) {
                console.error('Catch block error:', error);
                if (!res.headersSent) {
                    return next(error);
                }
            }
        });
    }
    /**
       * Add a new Nurses
       * @param req request object
       * @param res response object
       */
    static handleAddNewNurses(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { format, Name, comment, serviceId } = req.body;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const file = req.file;
                console.log(file);
                console.log('file in add new nurse', file.path);
                if (!format || !Name || !serviceId || !file || !file.path) {
                    return res.json({
                        message: 'All fields are required',
                        success: false
                    });
                }
                const service = yield database_1.Service.findById(serviceId);
                if (!service) {
                    return res.json({
                        message: 'Service not found',
                        success: false,
                    });
                }
                const nurse = yield database_1.Nurse.create({
                    serviceId,
                    Name,
                    Archive: Name + '.' + format.split('.')[1],
                    comment: comment || '',
                    files: file.path,
                });
                yield database_1.Notification.create({
                    clientId: service.clientId,
                    serviceId,
                    link1: `${nurse.files}`,
                    type: 'nurse',
                    read: false,
                });
                const filePath = path_1.default.join('public/Archive', (service === null || service === void 0 ? void 0 : service.nurseArchive) ? service === null || service === void 0 ? void 0 : service.nurseArchive : 'none.pdf');
                fs_1.default.access(filePath, fs_1.default.constants.F_OK, (err) => {
                    if (!err) {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
                const nurseFiles = yield database_1.Nurse.find({ serviceId });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const fileList = [];
                nurseFiles.map((nurse) => {
                    fileList.push(nurse === null || nurse === void 0 ? void 0 : nurse.files.split('/')[1]);
                });
                const id = (0, uuid4_1.default)();
                const zipFileName = id + '.zip';
                const outputFilePath = path_1.default.join('public/Archive', zipFileName);
                yield database_1.Service.findOneAndUpdate({ _id: serviceId }, { nurseArchive: zipFileName }, { new: true });
                const output = fs_1.default.createWriteStream(outputFilePath);
                output.on('error', (err) => {
                    console.error('Error creating archive:', err);
                    if (!res.headersSent) {
                        return next(err);
                    }
                });
                const archive = (0, archiver_1.default)('zip', {
                    zlib: { level: 9 }
                });
                archive.pipe(output);
                const sourceDir = 'public';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                fileList.forEach((file) => {
                    const fullPath = path_1.default.join(sourceDir, file);
                    if (fs_1.default.existsSync(fullPath)) {
                        const fileStream = fs_1.default.createReadStream(fullPath);
                        fileStream.on('error', (err) => {
                            console.error('Error reading file:', err);
                            if (!res.headersSent) {
                                return next(err);
                            }
                        });
                        archive.append(fileStream, { name: file });
                    }
                    else {
                        console.error('File not found:', fullPath);
                    }
                });
                // Finalize the archive
                yield archive.finalize();
                // Listen for archive completion
                yield output.on('close', () => {
                    if (service.Notification) {
                        (0, utils_1.sendEmail)(service.email, 'Atend - Nueva factura cargada', {
                            name: service.clientName,
                            serviceName: service.serviceName,
                            email: 'nurse',
                            password: undefined,
                            link: `https://clientes.atend.mx/${nurse.files}`
                        }, './template/documentNotification.handlebars');
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
            }
            catch (error) {
                console.error('Catch block error:', error);
                if (!res.headersSent) {
                    return next(error);
                }
            }
        });
    }
    /**
       * Add a new bill
       * @param req request object
       * @param res response object
       */
    static handleAddNewBill(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { period, Name, comment, serviceId } = req.body;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const file = req.files;
                console.log(file);
                console.log('file in add new nurse', file.path);
                if (!period || !Name || !serviceId || !file || !file[0] || !file[1] || !file[0].path || !file[1].path) {
                    return res.json({
                        message: 'All fields are required',
                        success: false
                    });
                }
                const service = yield database_1.Service.findById(serviceId);
                if (!service) {
                    return res.json({
                        message: 'Service not found',
                        success: false,
                    });
                }
                console.log(file);
                const bill = yield database_1.Bill.create({
                    serviceId,
                    period,
                    Name,
                    comment: comment || '',
                    file1: file[0].path,
                    file2: file[1].path,
                });
                yield database_1.Notification.create({
                    clientId: service.clientId,
                    serviceId,
                    link1: `${bill.file1}`,
                    link2: `${bill.file2}`,
                    type: 'bill',
                    read: false,
                });
                const filePath = path_1.default.join('public/Archive', (service === null || service === void 0 ? void 0 : service.billArchive) ? service === null || service === void 0 ? void 0 : service.billArchive : 'none.pdf');
                fs_1.default.access(filePath, fs_1.default.constants.F_OK, (err) => {
                    if (!err) {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
                const billFiles = yield database_1.Bill.find({ serviceId });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const fileList = [];
                billFiles.map((bill) => {
                    fileList.push(bill === null || bill === void 0 ? void 0 : bill.file1.split('/')[1]);
                    fileList.push(bill === null || bill === void 0 ? void 0 : bill.file2.split('/')[1]);
                });
                const id = (0, uuid4_1.default)();
                const zipFileName = id + '.zip';
                const outputFilePath = path_1.default.join('public/Archive', zipFileName);
                yield database_1.Service.findOneAndUpdate({ _id: serviceId }, { billArchive: zipFileName }, { new: true });
                const output = fs_1.default.createWriteStream(outputFilePath);
                output.on('error', (err) => {
                    console.error('Error creating archive:', err);
                    if (!res.headersSent) {
                        return next(err);
                    }
                });
                const archive = (0, archiver_1.default)('zip', {
                    zlib: { level: 9 }
                });
                archive.pipe(output);
                const sourceDir = 'public';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                fileList.forEach((file) => {
                    const fullPath = path_1.default.join(sourceDir, file);
                    if (fs_1.default.existsSync(fullPath)) {
                        const fileStream = fs_1.default.createReadStream(fullPath);
                        fileStream.on('error', (err) => {
                            console.error('Error reading file:', err);
                            if (!res.headersSent) {
                                return next(err);
                            }
                        });
                        archive.append(fileStream, { name: file });
                    }
                    else {
                        console.error('File not found:', fullPath);
                    }
                });
                // Finalize the archive
                yield archive.finalize();
                // Listen for archive completion
                yield output.on('close', () => {
                    if (service.Notification) {
                        (0, utils_1.sendEmail)(service.email, 'Atend - Nueva factura cargada', {
                            name: service.clientName,
                            serviceName: service.serviceName,
                            email: 'bill',
                            password: undefined,
                            link: `https://clientes.atend.mx/${bill.file1}`
                        }, './template/documentNotification.handlebars');
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
            }
            catch (error) {
                console.error('Catch block error:', error);
                if (!res.headersSent) {
                    return next(error);
                }
            }
        });
    }
    /**
       * Get all the bills
       * @param req request object
       * @param res response object
       */
    static handleGetAllBill(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const searchTerm = req.query.search || '.*';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const filter = req.query.filter === 'true';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const serviceId = req.query.serviceId;
                const bills = yield database_1.Bill.find({ Name: { $regex: searchTerm, $options: 'i' }, serviceId });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const billList = bills.map((bill) => bill.toObject());
                if (filter) {
                    billList.sort((a, b) => new Date(a.fileDate).getTime() - new Date(b.fileDate).getTime());
                }
                else {
                    billList.sort((a, b) => new Date(b.fileDate).getTime() - new Date(a.fileDate).getTime());
                }
                res.status(200).json({
                    message: 'Bill fetched successfully',
                    success: true,
                    data: billList,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
       * Get all the Blog
       * @param req request object
       * @param res response object
       */
    static handleGetAllBinnacle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const searchTerm = req.query.search || '.*';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const filter = req.query.filter === 'true';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const serviceId = req.query.serviceId;
                const blogs = yield database_1.Blog.find({ Name: { $regex: searchTerm, $options: 'i' }, serviceId });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const blogList = blogs.map((blog) => blog.toObject());
                if (filter) {
                    blogList.sort((a, b) => new Date(a.fileDate).getTime() - new Date(b.fileDate).getTime());
                }
                else {
                    blogList.sort((a, b) => new Date(b.fileDate).getTime() - new Date(a.fileDate).getTime());
                }
                res.status(200).json({
                    message: 'Bill fetched successfully',
                    success: true,
                    data: blogList,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
       * Get all the nurse
       * @param req request object
       * @param res response object
       */
    static handleGetAllNurse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const searchTerm = req.query.search || '.*';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const filter = req.query.filter === 'true';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const serviceId = req.query.serviceId;
                const nurses = yield database_1.Nurse.find({ Name: { $regex: searchTerm, $options: 'i' }, serviceId });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const nurseList = nurses.map((nurse) => nurse.toObject());
                if (filter) {
                    nurseList.sort((a, b) => new Date(a.fileDate).getTime() - new Date(b.fileDate).getTime());
                }
                else {
                    nurseList.sort((a, b) => new Date(b.fileDate).getTime() - new Date(a.fileDate).getTime());
                }
                res.status(200).json({
                    message: 'Bill fetched successfully',
                    success: true,
                    data: nurseList,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
       * update Bill
       * @param req request object
       * @param res response object
       */
    static handleUpdateABill(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { period, Name, comment, serviceId } = req.body;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const file = req.files;
                if (!period || !Name || !serviceId || !file[0].path || !file[1].path) {
                    return res.json({
                        message: 'All fields are required',
                        success: false
                    });
                }
                const bill = yield database_1.Bill.findById(serviceId);
                if ((bill === null || bill === void 0 ? void 0 : bill.file1) !== '' || (bill === null || bill === void 0 ? void 0 : bill.file1)) {
                    const filePath = path_1.default.join('public', bill === null || bill === void 0 ? void 0 : bill.file1.split('/')[1]);
                    fs_1.default.access(filePath, fs_1.default.constants.F_OK, (err) => {
                        if (!err) {
                            fs_1.default.unlinkSync(filePath);
                        }
                    });
                }
                if ((bill === null || bill === void 0 ? void 0 : bill.file2) !== '' || (bill === null || bill === void 0 ? void 0 : bill.file2)) {
                    const filePath = path_1.default.join('public', bill === null || bill === void 0 ? void 0 : bill.file2.split('/')[1]);
                    fs_1.default.access(filePath, fs_1.default.constants.F_OK, (err) => {
                        if (!err) {
                            fs_1.default.unlinkSync(filePath);
                        }
                    });
                }
                const now = new Date();
                const updatedBill = yield database_1.Bill.findOneAndUpdate({ _id: serviceId }, { comment: comment || '', Name, period, file1: file[0].path, file2: file[1].path, fileDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()) }, { new: true });
                if (!updatedBill) {
                    return res.status(404).json({ message: 'Service not found', success: false });
                }
                const service = yield database_1.Service.findById(serviceId);
                yield database_1.Notification.create({
                    clientId: service.clientId,
                    serviceId,
                    link1: `${bill === null || bill === void 0 ? void 0 : bill.file1}`,
                    link2: `${bill === null || bill === void 0 ? void 0 : bill.file2}`,
                    type: 'bill',
                    read: false,
                });
                if ((service === null || service === void 0 ? void 0 : service.billArchive) !== '' || (service === null || service === void 0 ? void 0 : service.billArchive)) {
                    const filePath = path_1.default.join('public/Archive', service === null || service === void 0 ? void 0 : service.billArchive);
                    fs_1.default.access(filePath, fs_1.default.constants.F_OK, (err) => {
                        if (!err) {
                            fs_1.default.unlinkSync(filePath);
                        }
                    });
                }
                const billFiles = yield database_1.Bill.find({ serviceId });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const fileList = [];
                billFiles.map((bill) => {
                    fileList.push(bill === null || bill === void 0 ? void 0 : bill.file1.split('/')[1]);
                    fileList.push(bill === null || bill === void 0 ? void 0 : bill.file2.split('/')[1]);
                });
                const id = (0, uuid4_1.default)();
                const zipFileName = id + '.zip';
                const outputFilePath = path_1.default.join('public/Archive', zipFileName);
                yield database_1.Service.findOneAndUpdate({ _id: serviceId }, { billArchive: zipFileName }, { new: true });
                const output = fs_1.default.createWriteStream(outputFilePath);
                output.on('error', (err) => {
                    console.error('Error creating archive:', err);
                    if (!res.headersSent) {
                        return next(err);
                    }
                });
                const archive = (0, archiver_1.default)('zip', {
                    zlib: { level: 9 }
                });
                archive.pipe(output);
                const sourceDir = 'public';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                fileList.forEach((file) => {
                    const fullPath = path_1.default.join(sourceDir, file);
                    if (fs_1.default.existsSync(fullPath)) {
                        const fileStream = fs_1.default.createReadStream(fullPath);
                        fileStream.on('error', (err) => {
                            console.error('Error reading file:', err);
                            if (!res.headersSent) {
                                return next(err);
                            }
                        });
                        archive.append(fileStream, { name: file });
                    }
                    else {
                        console.error('File not found:', fullPath);
                    }
                });
                // Finalize the archive
                yield archive.finalize();
                // Listen for archive completion
                yield output.on('close', () => {
                    res.status(200).json({ message: 'Service status updated successfully', success: true, data: updatedBill });
                });
                // Listen for errors
                archive.on('error', err => {
                    if (!res.headersSent) {
                        return next(err);
                    }
                });
            }
            catch (error) {
                if (!res.headersSent) {
                    return next(error);
                }
            }
        });
    }
    /**
       * update Binnacle
       * @param req request object
       * @param res response object
       */
    static handleUpdateABinnacle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { period, Name, comment, serviceId } = req.body;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const file = req.file;
                if (!period || !Name || !serviceId || !file.path) {
                    return res.json({
                        message: 'All fields are required',
                        success: false
                    });
                }
                const blog = yield database_1.Blog.findById(serviceId);
                if ((blog === null || blog === void 0 ? void 0 : blog.files) !== '' || (blog === null || blog === void 0 ? void 0 : blog.files)) {
                    const filePath = path_1.default.join('public', blog === null || blog === void 0 ? void 0 : blog.files.split('/')[1]);
                    fs_1.default.access(filePath, fs_1.default.constants.F_OK, (err) => {
                        if (!err) {
                            fs_1.default.unlinkSync(filePath);
                        }
                    });
                }
                const now = new Date();
                const updatedBlog = yield database_1.Blog.findOneAndUpdate({ _id: serviceId }, { comment: comment || '', Name, period, files: file.path, fileDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()) }, { new: true });
                if (!updatedBlog) {
                    return res.status(404).json({ message: 'Service not found', success: false });
                }
                const service = yield database_1.Service.findById(serviceId);
                yield database_1.Notification.create({
                    clientId: service.clientId,
                    serviceId,
                    link1: `${blog === null || blog === void 0 ? void 0 : blog.files}`,
                    type: 'binnacle',
                    read: false,
                });
                if ((service === null || service === void 0 ? void 0 : service.blogArchive) !== '' || (service === null || service === void 0 ? void 0 : service.blogArchive)) {
                    const filePath = path_1.default.join('public/Archive', service === null || service === void 0 ? void 0 : service.blogArchive);
                    fs_1.default.access(filePath, fs_1.default.constants.F_OK, (err) => {
                        if (!err) {
                            fs_1.default.unlinkSync(filePath);
                        }
                    });
                }
                const blogFiles = yield database_1.Blog.find({ serviceId });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const fileList = [];
                blogFiles.map((blog) => {
                    fileList.push(blog === null || blog === void 0 ? void 0 : blog.files.split('/')[1]);
                });
                const id = (0, uuid4_1.default)();
                const zipFileName = id + '.zip';
                const outputFilePath = path_1.default.join('public/Archive', zipFileName);
                yield database_1.Service.findOneAndUpdate({ _id: serviceId }, { blogArchive: zipFileName }, { new: true });
                const output = fs_1.default.createWriteStream(outputFilePath);
                output.on('error', (err) => {
                    console.error('Error creating archive:', err);
                    if (!res.headersSent) {
                        return next(err);
                    }
                });
                const archive = (0, archiver_1.default)('zip', {
                    zlib: { level: 9 }
                });
                archive.pipe(output);
                const sourceDir = 'public';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                fileList.forEach((file) => {
                    const fullPath = path_1.default.join(sourceDir, file);
                    if (fs_1.default.existsSync(fullPath)) {
                        const fileStream = fs_1.default.createReadStream(fullPath);
                        fileStream.on('error', (err) => {
                            console.error('Error reading file:', err);
                            if (!res.headersSent) {
                                return next(err);
                            }
                        });
                        archive.append(fileStream, { name: file });
                    }
                    else {
                        console.error('File not found:', fullPath);
                    }
                });
                // Finalize the archive
                yield archive.finalize();
                // Listen for archive completion
                yield output.on('close', () => {
                    res.status(200).json({ message: 'Service status updated successfully', success: true, data: updatedBlog });
                });
                // Listen for errors
                archive.on('error', err => {
                    if (!res.headersSent) {
                        return next(err);
                    }
                });
            }
            catch (error) {
                if (!res.headersSent) {
                    return next(error);
                }
            }
        });
    }
    /**
       * update nurse
       * @param req request object
       * @param res response object
       */
    static handleUpdateANurse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { format, Name, comment, serviceId } = req.body;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const file = req.file;
                if (!format || !Name || !serviceId || !file.path) {
                    return res.json({
                        message: 'All fields are required',
                        success: false
                    });
                }
                const nurse = yield database_1.Nurse.findById(serviceId);
                if ((nurse === null || nurse === void 0 ? void 0 : nurse.files) !== '' || (nurse === null || nurse === void 0 ? void 0 : nurse.files)) {
                    const filePath = path_1.default.join('public', nurse === null || nurse === void 0 ? void 0 : nurse.files.split('/')[1]);
                    fs_1.default.access(filePath, fs_1.default.constants.F_OK, (err) => {
                        if (!err) {
                            fs_1.default.unlinkSync(filePath);
                        }
                    });
                }
                const now = new Date();
                const updatedNurse = yield database_1.Nurse.findOneAndUpdate({ _id: serviceId }, { comment: comment || '', Archive: Name + '.' + format.split('.')[1], Name, files: file.path, fileDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()) }, { new: true });
                if (!updatedNurse) {
                    return res.status(404).json({ message: 'Service not found', success: false });
                }
                const service = yield database_1.Service.findById(serviceId);
                yield database_1.Notification.create({
                    clientId: service.clientId,
                    serviceId,
                    link1: `${nurse === null || nurse === void 0 ? void 0 : nurse.files}`,
                    type: 'nurse',
                    read: false,
                });
                if ((service === null || service === void 0 ? void 0 : service.nurseArchive) !== '' || (service === null || service === void 0 ? void 0 : service.nurseArchive)) {
                    const filePath = path_1.default.join('public/Archive', service === null || service === void 0 ? void 0 : service.nurseArchive);
                    fs_1.default.access(filePath, fs_1.default.constants.F_OK, (err) => {
                        if (!err) {
                            fs_1.default.unlinkSync(filePath);
                        }
                    });
                }
                const nurseFiles = yield database_1.Nurse.find({ serviceId });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const fileList = [];
                nurseFiles.map((nurse) => {
                    fileList.push(nurse === null || nurse === void 0 ? void 0 : nurse.files.split('/')[1]);
                });
                const id = (0, uuid4_1.default)();
                const zipFileName = id + '.zip';
                const outputFilePath = path_1.default.join('public/Archive', zipFileName);
                yield database_1.Service.findOneAndUpdate({ _id: serviceId }, { nurseArchive: zipFileName }, { new: true });
                const output = fs_1.default.createWriteStream(outputFilePath);
                output.on('error', (err) => {
                    console.error('Error creating archive:', err);
                    if (!res.headersSent) {
                        return next(err);
                    }
                });
                const archive = (0, archiver_1.default)('zip', {
                    zlib: { level: 9 }
                });
                archive.pipe(output);
                const sourceDir = 'public';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                fileList.forEach((file) => {
                    const fullPath = path_1.default.join(sourceDir, file);
                    if (fs_1.default.existsSync(fullPath)) {
                        const fileStream = fs_1.default.createReadStream(fullPath);
                        fileStream.on('error', (err) => {
                            console.error('Error reading file:', err);
                            if (!res.headersSent) {
                                return next(err);
                            }
                        });
                        archive.append(fileStream, { name: file });
                    }
                    else {
                        console.error('File not found:', fullPath);
                    }
                });
                // Finalize the archive
                yield archive.finalize();
                // Listen for archive completion
                yield output.on('close', () => {
                    res.status(200).json({ message: 'Service status updated successfully', success: true, data: updatedNurse });
                });
                // Listen for errors
                archive.on('error', err => {
                    if (!res.headersSent) {
                        return next(err);
                    }
                });
            }
            catch (error) {
                if (!res.headersSent) {
                    return next(error);
                }
            }
        });
    }
    /**
     * Delete a bill
     * @param req request object
     * @param res response object
     */
    static handleDeleteBill(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const user = yield database_1.Bill.findById(id);
                if ((user === null || user === void 0 ? void 0 : user.file1) !== '' || (user === null || user === void 0 ? void 0 : user.file1)) {
                    const updateFilePath = path_1.default.join('public', user === null || user === void 0 ? void 0 : user.file1.split('/')[1]);
                    fs_1.default.access(updateFilePath, fs_1.default.constants.F_OK, (err) => {
                        if (!err) {
                            fs_1.default.unlinkSync(updateFilePath);
                        }
                    });
                }
                if ((user === null || user === void 0 ? void 0 : user.file2) !== '' || (user === null || user === void 0 ? void 0 : user.file2)) {
                    const updateFilePath = path_1.default.join('public', user === null || user === void 0 ? void 0 : user.file2.split('/')[1]);
                    fs_1.default.access(updateFilePath, fs_1.default.constants.F_OK, (err) => {
                        if (!err) {
                            fs_1.default.unlinkSync(updateFilePath);
                        }
                    });
                }
                const result = yield database_1.Bill.findByIdAndDelete(id);
                if (!result) {
                    return res.status(404).json({ message: 'Bill not found' });
                }
                const service = yield database_1.Service.findById(user === null || user === void 0 ? void 0 : user.serviceId);
                const updateFilePath = path_1.default.join('public/Archive', service === null || service === void 0 ? void 0 : service.billArchive);
                fs_1.default.access(updateFilePath, fs_1.default.constants.F_OK, (err) => {
                    if (!err) {
                        fs_1.default.unlinkSync(updateFilePath);
                    }
                });
                const billFiles = yield database_1.Bill.find({ serviceId: user === null || user === void 0 ? void 0 : user.serviceId });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const fileList = [];
                billFiles.map((bill) => {
                    fileList.push(bill === null || bill === void 0 ? void 0 : bill.file1.split('/')[1]);
                    fileList.push(bill === null || bill === void 0 ? void 0 : bill.file2.split('/')[1]);
                });
                const uid = (0, uuid4_1.default)();
                const zipFileName = uid + '.zip';
                const outputFilePath = path_1.default.join('public/Archive', zipFileName);
                yield database_1.Service.findOneAndUpdate({ _id: user === null || user === void 0 ? void 0 : user.serviceId }, { billArchive: zipFileName }, { new: true });
                const output = fs_1.default.createWriteStream(outputFilePath);
                output.on('error', (err) => {
                    console.error('Error creating archive:', err);
                    if (!res.headersSent) {
                        return next(err);
                    }
                });
                const archive = (0, archiver_1.default)('zip', {
                    zlib: { level: 9 }
                });
                archive.pipe(output);
                const sourceDir = 'public';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                fileList.forEach((file) => {
                    const fullPath = path_1.default.join(sourceDir, file);
                    if (fs_1.default.existsSync(fullPath)) {
                        const fileStream = fs_1.default.createReadStream(fullPath);
                        fileStream.on('error', (err) => {
                            console.error('Error reading file:', err);
                            if (!res.headersSent) {
                                return next(err);
                            }
                        });
                        archive.append(fileStream, { name: file });
                    }
                    else {
                        console.error('File not found:', fullPath);
                    }
                });
                // Finalize the archive
                yield archive.finalize();
                // Listen for archive completion
                yield output.on('close', () => {
                    return res.status(200).send({ message: 'Bill deleted successfully' });
                });
                // Listen for errors
                archive.on('error', err => {
                    if (!res.headersSent) {
                        return next(err);
                    }
                });
            }
            catch (error) {
                if (!res.headersSent) {
                    return next(error);
                }
            }
        });
    }
    /**
     * Delete a binnacle
     * @param req request object
     * @param res response object
     */
    static handleDeleteBinnacle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const user = yield database_1.Blog.findById(id);
                if ((user === null || user === void 0 ? void 0 : user.files) !== '' || (user === null || user === void 0 ? void 0 : user.files)) {
                    const updateFilePath = path_1.default.join('public', user === null || user === void 0 ? void 0 : user.files.split('/')[1]);
                    fs_1.default.access(updateFilePath, fs_1.default.constants.F_OK, (err) => {
                        if (!err) {
                            fs_1.default.unlinkSync(updateFilePath);
                        }
                    });
                }
                const result = yield database_1.Blog.findByIdAndDelete(id);
                if (!result) {
                    return res.status(404).json({ message: 'Binnacle not found' });
                }
                const service = yield database_1.Service.findById(user === null || user === void 0 ? void 0 : user.serviceId);
                const updateFilePath = path_1.default.join('public/Archive', service === null || service === void 0 ? void 0 : service.blogArchive);
                fs_1.default.access(updateFilePath, fs_1.default.constants.F_OK, (err) => {
                    if (!err) {
                        fs_1.default.unlinkSync(updateFilePath);
                    }
                });
                const blogFiles = yield database_1.Blog.find({ serviceId: user === null || user === void 0 ? void 0 : user.serviceId });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const fileList = [];
                blogFiles.map((blog) => {
                    fileList.push(blog === null || blog === void 0 ? void 0 : blog.files.split('/')[1]);
                });
                const uid = (0, uuid4_1.default)();
                const zipFileName = uid + '.zip';
                const outputFilePath = path_1.default.join('public/Archive', zipFileName);
                yield database_1.Service.findOneAndUpdate({ _id: user === null || user === void 0 ? void 0 : user.serviceId }, { blogArchive: zipFileName }, { new: true });
                const output = fs_1.default.createWriteStream(outputFilePath);
                output.on('error', (err) => {
                    console.error('Error creating archive:', err);
                    if (!res.headersSent) {
                        return next(err);
                    }
                });
                const archive = (0, archiver_1.default)('zip', {
                    zlib: { level: 9 }
                });
                archive.pipe(output);
                const sourceDir = 'public';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                fileList.forEach((file) => {
                    const fullPath = path_1.default.join(sourceDir, file);
                    if (fs_1.default.existsSync(fullPath)) {
                        const fileStream = fs_1.default.createReadStream(fullPath);
                        fileStream.on('error', (err) => {
                            console.error('Error reading file:', err);
                            if (!res.headersSent) {
                                return next(err);
                            }
                        });
                        archive.append(fileStream, { name: file });
                    }
                    else {
                        console.error('File not found:', fullPath);
                    }
                });
                // Finalize the archive
                yield archive.finalize();
                // Listen for archive completion
                yield output.on('close', () => {
                    return res.status(200).send({ message: 'Binnacle deleted successfully' });
                });
                // Listen for errors
                archive.on('error', err => {
                    if (!res.headersSent) {
                        return next(err);
                    }
                });
            }
            catch (error) {
                if (!res.headersSent) {
                    return next(error);
                }
            }
        });
    }
    /**
     * Delete a nurse
     * @param req request object
     * @param res response object
     */
    static handleDeleteNurse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const user = yield database_1.Nurse.findById(id);
                if ((user === null || user === void 0 ? void 0 : user.files) !== '' || (user === null || user === void 0 ? void 0 : user.files)) {
                    const updateFilePath = path_1.default.join('public', user === null || user === void 0 ? void 0 : user.files.split('/')[1]);
                    fs_1.default.access(updateFilePath, fs_1.default.constants.F_OK, (err) => {
                        if (!err) {
                            fs_1.default.unlinkSync(updateFilePath);
                        }
                    });
                }
                const result = yield database_1.Nurse.findByIdAndDelete(id);
                if (!result) {
                    return res.status(404).json({ message: 'Nurse not found' });
                }
                const service = yield database_1.Service.findById(user === null || user === void 0 ? void 0 : user.serviceId);
                const updateFilePath = path_1.default.join('public/Archive', service === null || service === void 0 ? void 0 : service.nurseArchive);
                fs_1.default.access(updateFilePath, fs_1.default.constants.F_OK, (err) => {
                    if (!err) {
                        fs_1.default.unlinkSync(updateFilePath);
                    }
                });
                const nurseFiles = yield database_1.Nurse.find({ serviceId: user === null || user === void 0 ? void 0 : user.serviceId });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const fileList = [];
                nurseFiles.map((nurse) => {
                    fileList.push(nurse === null || nurse === void 0 ? void 0 : nurse.files.split('/')[1]);
                });
                const uid = (0, uuid4_1.default)();
                const zipFileName = uid + '.zip';
                const outputFilePath = path_1.default.join('public/Archive', zipFileName);
                yield database_1.Service.findOneAndUpdate({ _id: user === null || user === void 0 ? void 0 : user.serviceId }, { nurseArchive: zipFileName }, { new: true });
                const output = fs_1.default.createWriteStream(outputFilePath);
                output.on('error', (err) => {
                    console.error('Error creating archive:', err);
                    if (!res.headersSent) {
                        return next(err);
                    }
                });
                const archive = (0, archiver_1.default)('zip', {
                    zlib: { level: 9 }
                });
                archive.pipe(output);
                const sourceDir = 'public';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                fileList.forEach((file) => {
                    const fullPath = path_1.default.join(sourceDir, file);
                    if (fs_1.default.existsSync(fullPath)) {
                        const fileStream = fs_1.default.createReadStream(fullPath);
                        fileStream.on('error', (err) => {
                            console.error('Error reading file:', err);
                            if (!res.headersSent) {
                                return next(err);
                            }
                        });
                        archive.append(fileStream, { name: file });
                    }
                    else {
                        console.error('File not found:', fullPath);
                    }
                });
                // Finalize the archive
                yield archive.finalize();
                // Listen for archive completion
                yield output.on('close', () => {
                    return res.status(200).send({ message: 'Nurse deleted successfully' });
                });
                // Listen for errors
                archive.on('error', err => {
                    if (!res.headersSent) {
                        return next(err);
                    }
                });
            }
            catch (error) {
                if (!res.headersSent) {
                    return next(error);
                }
            }
        });
    }
}
exports.default = adminController;
//# sourceMappingURL=admin.controller.js.map