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
const nodemailer_1 = __importDefault(require("nodemailer"));
const handlebars_1 = __importDefault(require("handlebars"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../../config");
const sendEmail = (email, subject, payload, template) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            host: config_1.EMAIL_HOST,
            port: 465,
            secure: false,
            auth: {
                user: config_1.EMAIL_USERNAME,
                pass: config_1.EMAIL_PASSWORD, // naturally, replace both with your real credentials or an application-specific password
            },
        });
        const source = fs_1.default.readFileSync(path_1.default.join(__dirname, template), 'utf8');
        const compiledTemplate = handlebars_1.default.compile(source);
        const options = () => {
            return {
                from: config_1.FROM_EMAIL,
                to: email,
                subject: subject,
                html: compiledTemplate(payload),
            };
        };
        // Send email
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        transporter.sendMail(options(), (error, info) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log('email sent');
            }
        });
    }
    catch (error) {
        return error;
    }
});
exports.default = sendEmail;
//# sourceMappingURL=sendEmail.js.map