import nodemailer from "nodemailer";

export const sendEmail = async ( to, subject, html )=>{
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    
    const info = await transporter.sendMail({
        from: `"Social media app" <${process.env.EMAIL}>`, // sender address
        to, // list of receivers
        subject, // Subject line
        html // html body
    });
}
