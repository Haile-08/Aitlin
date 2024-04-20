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
    static handleAddClient(req, res) {
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
                    const mail = (0, utils_1.sendEmail)(client.email, 'Welcome to Aitlin', {
                        name: client.Name,
                        email: client.email,
                        password,
                        link: undefined
                    }, './template/newClient.handlebars');
                    console.log('email return', mail);
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
            }
            catch (err) {
                return res.status(500).json({ message: err.message, success: false });
            }
        });
    }
    /**
       * get all clients
       * @param req request object
       * @param res response object
       */
    static handleGetAllClient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageNum = Number(req.query.page) || 0;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const searchTerm = req.query.search || '.*';
                console.log('search', searchTerm);
                const servicePerPage = 9;
                const services = yield database_1.Service.find({ serviceName: { $regex: searchTerm, $options: 'i' } });
                const startIndex = pageNum * servicePerPage;
                const endIndex = startIndex + servicePerPage;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const serviceList = services.slice(startIndex, endIndex).map((service) => service.toObject());
                console.log(services);
                res.status(200).json({
                    message: 'Services fetched successfully',
                    success: true,
                    services: serviceList,
                    hasMore: endIndex < services.length,
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Internal server error', success: false });
            }
        });
    }
    /**
       * get all clients
       * @param req request object
       * @param res response object
       */
    static handleGetASingleService(req, res) {
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
                console.error(err);
                res.status(500).json({ message: 'Internal server error', success: false });
            }
        });
    }
    /**
       * update the service status
       * @param req request object
       * @param res response object
       */
    static handleServiceStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, status } = req.body;
                console.log('id', id);
                console.log('status', status);
                const updatedService = yield database_1.Service.findByIdAndUpdate(id, { status }, { new: true });
                if (!updatedService) {
                    return res.status(404).json({ message: 'Service not found', success: false });
                }
                res.status(200).json({ message: 'Service status updated successfully', success: true, updatedService });
            }
            catch (error) {
                res.status(500).json({ message: 'Internal server error', success: false });
            }
        });
    }
    /**
       * Add a new Binnacle
       * @param req request object
       * @param res response object
       */
    static handleAddNewBinnacle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { period, comment, serviceId } = req.body;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const file = req.file;
                if (!period || !comment || !serviceId || !file.path) {
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
                    comment,
                    files: file.path.split('/')[2],
                });
                const filePath = path_1.default.join('dist/public/Archive', (service === null || service === void 0 ? void 0 : service.blogArchive) ? service === null || service === void 0 ? void 0 : service.blogArchive : 'none.pdf');
                if (fs_1.default.existsSync(filePath)) {
                    fs_1.default.unlinkSync(filePath);
                }
                const blogFiles = yield database_1.Blog.find({ serviceId });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const fileList = [];
                blogFiles.map((blog) => {
                    fileList.push(blog === null || blog === void 0 ? void 0 : blog.files);
                });
                const id = (0, uuid4_1.default)();
                const zipFileName = id + '.zip';
                const outputFilePath = path_1.default.join('dist/public/Archive', zipFileName);
                // Check if the target directory exists, create it if it doesn't
                if (!fs_1.default.existsSync('public/Archive')) {
                    fs_1.default.mkdirSync('public/Archive', { recursive: true });
                }
                yield database_1.Service.findOneAndUpdate({ _id: serviceId }, { blogArchive: zipFileName }, { new: true });
                const output = fs_1.default.createWriteStream(outputFilePath);
                const archive = (0, archiver_1.default)('zip', {
                    zlib: { level: 9 }
                });
                archive.pipe(output);
                const sourceDir = 'dist/public';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                fileList.forEach((file) => {
                    archive.append(fs_1.default.createReadStream(`${sourceDir}/${file}`), { name: file });
                });
                // Finalize the archive
                yield archive.finalize();
                // Listen for archive completion
                yield output.on('close', () => {
                    console.log('Archive created successfully.');
                    if (service.Notification) {
                        (0, utils_1.sendEmail)(service.email, 'New Binnacle document', {
                            name: service.clientName,
                            email: 'binnacle',
                            password: undefined,
                            link: `https://aitlin.vercel.app/${blog.files}`
                        }, './template/documentNotification.handlebars');
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
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Internal server error', success: false });
            }
        });
    }
    /**
       * Add a new Nurses
       * @param req request object
       * @param res response object
       */
    static handleAddNewNurses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { format, Name, comment, serviceId } = req.body;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const file = req.file;
                if (!format || !Name || !comment || !serviceId || !file.path) {
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
                    Archive: Name + '.' + format.split('/')[1],
                    comment,
                    files: file.path.split('/')[2],
                });
                const filePath = path_1.default.join('dist/public/Archive', (service === null || service === void 0 ? void 0 : service.nurseArchive) ? service === null || service === void 0 ? void 0 : service.nurseArchive : 'none.pdf');
                if (fs_1.default.existsSync(filePath)) {
                    fs_1.default.unlinkSync(filePath);
                }
                const nurseFiles = yield database_1.Nurse.find({ serviceId });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const fileList = [];
                nurseFiles.map((nurse) => {
                    fileList.push(nurse === null || nurse === void 0 ? void 0 : nurse.files);
                });
                const id = (0, uuid4_1.default)();
                const zipFileName = id + '.zip';
                const outputFilePath = path_1.default.join('dist/public/Archive', zipFileName);
                // Check if the target directory exists, create it if it doesn't
                if (!fs_1.default.existsSync('public/Archive')) {
                    fs_1.default.mkdirSync('public/Archive', { recursive: true });
                }
                yield database_1.Service.findOneAndUpdate({ _id: serviceId }, { nurseArchive: zipFileName }, { new: true });
                const output = fs_1.default.createWriteStream(outputFilePath);
                const archive = (0, archiver_1.default)('zip', {
                    zlib: { level: 9 }
                });
                archive.pipe(output);
                const sourceDir = 'dist/public';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                fileList.forEach((file) => {
                    archive.append(fs_1.default.createReadStream(`${sourceDir}/${file}`), { name: file });
                });
                // Finalize the archive
                yield archive.finalize();
                // Listen for archive completion
                yield output.on('close', () => {
                    console.log('Archive created successfully.');
                    if (service.Notification) {
                        (0, utils_1.sendEmail)(service.email, 'New nurse document', {
                            name: service.clientName,
                            email: 'nurse',
                            password: undefined,
                            link: `https://aitlin.vercel.app/${nurse.files}`
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
                    throw err;
                });
            }
            catch (error) {
                res.status(500).json({ message: 'Internal server error', success: false });
            }
        });
    }
    /**
       * Add a new bill
       * @param req request object
       * @param res response object
       */
    static handleAddNewBill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { period, comment, serviceId } = req.body;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const file = req.file;
                if (!period || !comment || !serviceId || !file.path) {
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
                const bill = yield database_1.Bill.create({
                    serviceId,
                    period,
                    comment,
                    files: file.path.split('/')[2],
                });
                const filePath = path_1.default.join('dist/public/Archive', (service === null || service === void 0 ? void 0 : service.nurseArchive) ? service === null || service === void 0 ? void 0 : service.nurseArchive : 'none.pdf');
                if (fs_1.default.existsSync(filePath)) {
                    fs_1.default.unlinkSync(filePath);
                }
                const billFiles = yield database_1.Bill.find({ serviceId });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const fileList = [];
                billFiles.map((bill) => {
                    fileList.push(bill === null || bill === void 0 ? void 0 : bill.files);
                });
                const id = (0, uuid4_1.default)();
                const zipFileName = id + '.zip';
                const outputFilePath = path_1.default.join('dist/public/Archive', zipFileName);
                yield database_1.Service.findOneAndUpdate({ _id: serviceId }, { billArchive: zipFileName }, { new: true });
                const output = fs_1.default.createWriteStream(outputFilePath);
                const archive = (0, archiver_1.default)('zip', {
                    zlib: { level: 9 }
                });
                archive.pipe(output);
                const sourceDir = 'dist/public';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                fileList.forEach((file) => {
                    archive.append(fs_1.default.createReadStream(`${sourceDir}/${file}`), { name: file });
                });
                // Finalize the archive
                yield archive.finalize();
                // Listen for archive completion
                yield output.on('close', () => {
                    console.log('Archive created successfully.');
                    if (service.Notification) {
                        (0, utils_1.sendEmail)(service.email, 'New bill document', {
                            name: service.clientName,
                            email: 'bill',
                            password: undefined,
                            link: `https://aitlin.vercel.app/${bill.files}`
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
                    throw err;
                });
            }
            catch (error) {
                res.status(500).json({ message: 'Internal server error', success: false });
            }
        });
    }
    /**
       * Get all the bills
       * @param req request object
       * @param res response object
       */
    static handleGetAllBill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const searchTerm = req.query.search || '.*';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const filter = req.query.filter === 'true';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const serviceId = req.query.serviceId;
                const bills = yield database_1.Bill.find({ comment: { $regex: searchTerm, $options: 'i' }, serviceId });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const billList = bills.map((bill) => bill.toObject());
                console.log('filter', filter);
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
                res.status(500).json({ message: 'Internal server error', success: false });
            }
        });
    }
    /**
       * Get all the Blog
       * @param req request object
       * @param res response object
       */
    static handleGetAllBinnacle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const searchTerm = req.query.search || '.*';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const filter = req.query.filter === 'true';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const serviceId = req.query.serviceId;
                const blogs = yield database_1.Blog.find({ comment: { $regex: searchTerm, $options: 'i' }, serviceId });
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
                res.status(500).json({ message: 'Internal server error', success: false });
            }
        });
    }
    /**
       * Get all the nurse
       * @param req request object
       * @param res response object
       */
    static handleGetAllNurse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const searchTerm = req.query.search || '.*';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const filter = req.query.filter === 'true';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const serviceId = req.query.serviceId;
                const nurses = yield database_1.Nurse.find({ comment: { $regex: searchTerm, $options: 'i' }, serviceId });
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
                res.status(500).json({ message: 'Internal server error', success: false });
            }
        });
    }
    /**
       * update Bill
       * @param req request object
       * @param res response object
       */
    static handleUpdateABill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { period, comment, serviceId } = req.body;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const file = req.file;
                if (!period || !comment || !serviceId || !file.path) {
                    return res.json({
                        message: 'All fields are required',
                        success: false
                    });
                }
                const bill = yield database_1.Bill.findById(serviceId);
                const filePath = path_1.default.join(__dirname, 'public', (bill === null || bill === void 0 ? void 0 : bill.files) || '');
                if (fs_1.default.existsSync(filePath)) {
                    fs_1.default.unlinkSync(filePath);
                    console.log('File removed successfully.');
                }
                else {
                    console.log('File does not exist.');
                }
                const now = new Date();
                const updatedBill = yield database_1.Bill.findOneAndUpdate({ _id: serviceId }, { comment, period, files: file.path.split('/')[1], fileDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()) }, { new: true });
                if (!updatedBill) {
                    return res.status(404).json({ message: 'Service not found', success: false });
                }
                const service = yield database_1.Service.findById(serviceId);
                const updateFilePath = path_1.default.join('dist/public/Archive', (service === null || service === void 0 ? void 0 : service.billArchive) ? service === null || service === void 0 ? void 0 : service.billArchive : 'none.pdf');
                if (fs_1.default.existsSync(updateFilePath)) {
                    fs_1.default.unlinkSync(updateFilePath);
                }
                const billFiles = yield database_1.Bill.find({ serviceId });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const fileList = [];
                billFiles.map((bill) => {
                    fileList.push(bill === null || bill === void 0 ? void 0 : bill.files);
                });
                const id = (0, uuid4_1.default)();
                const zipFileName = id + '.zip';
                const outputFilePath = path_1.default.join('dist/public/Archive', zipFileName);
                // Check if the target directory exists, create it if it doesn't
                if (!fs_1.default.existsSync('public/Archive')) {
                    fs_1.default.mkdirSync('public/Archive', { recursive: true });
                }
                yield database_1.Service.findOneAndUpdate({ _id: serviceId }, { billArchive: zipFileName }, { new: true });
                const output = fs_1.default.createWriteStream(outputFilePath);
                const archive = (0, archiver_1.default)('zip', {
                    zlib: { level: 9 }
                });
                archive.pipe(output);
                const sourceDir = 'dist/public';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                fileList.forEach((file) => {
                    archive.append(fs_1.default.createReadStream(`${sourceDir}/${file}`), { name: file });
                });
                // Finalize the archive
                yield archive.finalize();
                // Listen for archive completion
                yield output.on('close', () => {
                    console.log('Archive created successfully.');
                    res.status(200).json({ message: 'Service status updated successfully', success: true, data: updatedBill });
                });
                // Listen for errors
                archive.on('error', err => {
                    throw err;
                });
            }
            catch (error) {
                res.status(500).json({ message: 'Internal server error', success: false });
            }
        });
    }
    /**
       * update Binnacle
       * @param req request object
       * @param res response object
       */
    static handleUpdateABinnacle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { period, comment, serviceId } = req.body;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const file = req.file;
                if (!period || !comment || !serviceId || !file.path) {
                    return res.json({
                        message: 'All fields are required',
                        success: false
                    });
                }
                const blog = yield database_1.Blog.findById(serviceId);
                const filePath = path_1.default.join(__dirname, 'public', (blog === null || blog === void 0 ? void 0 : blog.files) || '');
                if (fs_1.default.existsSync(filePath)) {
                    fs_1.default.unlinkSync(filePath);
                    console.log('File removed successfully.');
                }
                else {
                    console.log('File does not exist.');
                }
                const now = new Date();
                const updatedBlog = yield database_1.Blog.findOneAndUpdate({ _id: serviceId }, { comment, period, files: file.path.split('/')[1], fileDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()) }, { new: true });
                if (!updatedBlog) {
                    return res.status(404).json({ message: 'Service not found', success: false });
                }
                const service = yield database_1.Service.findById(serviceId);
                const updateFilePath = path_1.default.join('dist/public/Archive', (service === null || service === void 0 ? void 0 : service.blogArchive) ? service === null || service === void 0 ? void 0 : service.blogArchive : 'none.pdf');
                if (fs_1.default.existsSync(updateFilePath)) {
                    fs_1.default.unlinkSync(updateFilePath);
                }
                const blogFiles = yield database_1.Blog.find({ serviceId });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const fileList = [];
                blogFiles.map((blog) => {
                    fileList.push(blog === null || blog === void 0 ? void 0 : blog.files);
                });
                const id = (0, uuid4_1.default)();
                const zipFileName = id + '.zip';
                const outputFilePath = path_1.default.join('dist/public/Archive', zipFileName);
                // Check if the target directory exists, create it if it doesn't
                if (!fs_1.default.existsSync('public/Archive')) {
                    fs_1.default.mkdirSync('public/Archive', { recursive: true });
                }
                yield database_1.Service.findOneAndUpdate({ _id: serviceId }, { blogArchive: zipFileName }, { new: true });
                const output = fs_1.default.createWriteStream(outputFilePath);
                const archive = (0, archiver_1.default)('zip', {
                    zlib: { level: 9 }
                });
                archive.pipe(output);
                const sourceDir = 'dist/public';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                fileList.forEach((file) => {
                    archive.append(fs_1.default.createReadStream(`${sourceDir}/${file}`), { name: file });
                });
                // Finalize the archive
                yield archive.finalize();
                // Listen for archive completion
                yield output.on('close', () => {
                    console.log('Archive created successfully.');
                    res.status(200).json({ message: 'Service status updated successfully', success: true, data: updatedBlog });
                });
                // Listen for errors
                archive.on('error', err => {
                    throw err;
                });
            }
            catch (error) {
                res.status(500).json({ message: 'Internal server error', success: false });
            }
        });
    }
    /**
       * update nurse
       * @param req request object
       * @param res response object
       */
    static handleUpdateANurse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { format, Name, comment, serviceId } = req.body;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const file = req.file;
                if (!format || !Name || !comment || !serviceId || !file.path) {
                    return res.json({
                        message: 'All fields are required',
                        success: false
                    });
                }
                const nurse = yield database_1.Nurse.findById(serviceId);
                const filePath = path_1.default.join('dist/public', (nurse === null || nurse === void 0 ? void 0 : nurse.files) || '');
                if (fs_1.default.existsSync(filePath)) {
                    fs_1.default.unlinkSync(filePath);
                    console.log('File removed successfully.');
                }
                else {
                    console.log('File does not exist.');
                }
                const now = new Date();
                const updatedNurse = yield database_1.Nurse.findOneAndUpdate({ _id: serviceId }, { comment, Archive: Name + '.' + format.split('/')[1], Name, files: file.path.split('/')[2], fileDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()) }, { new: true });
                if (!updatedNurse) {
                    return res.status(404).json({ message: 'Service not found', success: false });
                }
                const service = yield database_1.Service.findById(serviceId);
                const updateFilePath = path_1.default.join('dist/public/Archive', (service === null || service === void 0 ? void 0 : service.nurseArchive) ? service === null || service === void 0 ? void 0 : service.nurseArchive : 'none.pdf');
                if (fs_1.default.existsSync(updateFilePath)) {
                    fs_1.default.unlinkSync(updateFilePath);
                }
                const nurseFiles = yield database_1.Nurse.find({ serviceId });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const fileList = [];
                nurseFiles.map((nurse) => {
                    fileList.push(nurse === null || nurse === void 0 ? void 0 : nurse.files);
                });
                const id = (0, uuid4_1.default)();
                const zipFileName = id + '.zip';
                const outputFilePath = path_1.default.join('dist/public/Archive', zipFileName);
                // Check if the target directory exists, create it if it doesn't
                if (!fs_1.default.existsSync('public/Archive')) {
                    fs_1.default.mkdirSync('public/Archive', { recursive: true });
                }
                yield database_1.Service.findOneAndUpdate({ _id: serviceId }, { nurseArchive: zipFileName }, { new: true });
                const output = fs_1.default.createWriteStream(outputFilePath);
                const archive = (0, archiver_1.default)('zip', {
                    zlib: { level: 9 }
                });
                archive.pipe(output);
                const sourceDir = 'dist/public';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                fileList.forEach((file) => {
                    archive.append(fs_1.default.createReadStream(`${sourceDir}/${file}`), { name: file });
                });
                // Finalize the archive
                yield archive.finalize();
                // Listen for archive completion
                yield output.on('close', () => {
                    console.log('Archive created successfully.');
                    res.status(200).json({ message: 'Service status updated successfully', success: true, data: updatedNurse });
                });
                // Listen for errors
                archive.on('error', err => {
                    throw err;
                });
            }
            catch (error) {
                res.status(500).json({ message: 'Internal server error', success: false });
            }
        });
    }
}
exports.default = adminController;
//# sourceMappingURL=admin.controller.js.map