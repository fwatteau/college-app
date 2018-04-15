// const nodemailer = require('nodemailer');
/*
* Hi,

I try to import a library from a script written in js :
    const nodemailer = require('../node_modules/nodemailer');

I try several path ('nodemailer', '../../nodemailer') but none was succedeed.

It seems possible ? i see it in an example on yout guthub : https://github.com/netlify/code-examples/blob/master/function_examples/rest/func/text.js with
* */
// Generate test SMTP service account from ethereal.email
exports.handler = function(event, context, callback) {
    console.log(nodemailer);
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_SMTP,
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USER, // generated ethereal user
            pass: process.env.MAIL_PASS // generated ethereal password
        }
    });
    console.log(transporter);
    // setup email data with unicode symbols
    const mailOptions = {
        from: '"College Communautaire 🎓" <collegecommunautaire@nordnet.fr>', // sender address
        to: 'f.watteau@gmail.com', // list of receivers
        subject: 'Ajout d\'informations ✔', // Subject line
        text: 'Zen soyons zen ?', // plain text body
        html: '<b>Zen soyons zen?</b>' // html body
    };
    console.log(mailOptions);
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s by %s', info.messageId, '${process.env.MAIL_USER}');
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });

    callback(null, {
        statusCode: 200,
        body: JSON.stringify({traitement: 'done'})
    });
};