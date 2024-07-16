const nodemailer = require("nodemailer");
const expressAsyncHandler = require("express-async-handler");

module.exports.sendMail = expressAsyncHandler(async (data, req, res)=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure:true,
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASSWORD,
        }
    });
    const info = await transporter.sendMail({
        from: "Hello 👻", // sender address
        to: data.email, // list of receivers
        subject: data.subject, // Subject line
        text: data.message, // plain text body
    });
});