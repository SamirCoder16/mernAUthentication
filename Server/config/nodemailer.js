import nodemailer from 'nodemailer'

// Create a transporter object using the default SMTP transport using { BREVO } 
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER, // generated ethereal user
        pass: process.env.SMTP_PASS, // generated ethereal password
    },
})

export default transporter;