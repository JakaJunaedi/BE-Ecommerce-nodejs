const nodeMailer = require('nodemailer');

exports.kirimEmail = dataEmail => {
    //console.log(dataEmail);
    let transporter = nodeMailer.createTransport({ 
        host: "smtp.mailtrap.io",
        port: 2525,
        secure: false, // true port 465
        auth: {
            user: "b9f5cb6711ee53",
            pass: "653be4688ac561"
        }
    });

    return (
        transporter.sendMail(dataEmail)
        .then(info => console.log(`email terkirim: ${info.message}`))
        .catch(err => console.log(`Terjadi kesalahan: ${err}`))
    )
}