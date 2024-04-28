const fs = require('fs');
const path = require('path');
const nodemailer = require("nodemailer");
const { EmailTemplate } = require('./TemplateUtility');

function extractEmailsFromFile() {
    let readfilePath = path.join(__dirname, '../InputData/BangloreITCompanies.txt');
    // let writefilePath = path.join(__dirname, '../OutputData/Emails.txt');
    const data = fs.readFileSync(readfilePath, 'utf8');
    const companies = data.split('\n\n');
    let companyDetails = {};

    companies.forEach(company => {
        let lines = company.split('\n').filter(line => line.trim() !== '');

        lines.forEach(line => {
            if (line.toLowerCase().includes('email')) {
                let emailParts = line.split(':');
                if (emailParts.length >= 2) {
                    let email = emailParts[1].trim().replace(/[-\s]/g, '');
                    companyDetails[email] = false; // Set email as key with boolean value
                } else {
                    console.log('Email format is incorrect in line:', line);
                }
            }
        });
    });

    // fs.writeFileSync(writefilePath, JSON.stringify(companyDetails, null, 2));
    const maxEntriesPerFile = 350;
    let fileCounter = 1;
    let entriesWritten = 0;
    Object.entries(companyDetails).forEach(([email, value]) => {
        if(entriesWritten % maxEntriesPerFile === 0){
            let writefilePath = path.join(__dirname, `../OutputData/Emails${fileCounter}.txt`);
            let dataToWrite = Object.fromEntries(Object.entries(companyDetails).slice(entriesWritten, entriesWritten + maxEntriesPerFile));
            fs.writeFileSync(writefilePath, JSON.stringify(dataToWrite, null, 2));
            fileCounter++;
        }
        entriesWritten++;
    });
    return true;
}

async function SendEmailsToCompanies() {
    let count = 1;
    remainingpath = null
    // remainingpath = path.join(__dirname, '../OutputData/Remaining.txt')
    if(remainingpath!=null) {
            const companiesEmails = fs.readFileSync(remainingpath, 'utf-8');
            const companiesEmailsJson = JSON.parse(companiesEmails)
            let emailCount = 1
            const resumeAttachment = path.join(__dirname, '../InputData/yrsk_mit_resume_9.pdf')
            for (const [email, value] of Object.entries(companiesEmailsJson)) {
                const template = EmailTemplate();
                try {
                    if (email !== "") {
                        regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                        if (!regex.test(email)) {
                            break
                        }
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        await sendEmail(email, template, resumeAttachment);
                        console.log(`${emailCount++} ${email}`);
                    }
                } catch (error) {
                    console.error(`Error sending email to ${email}: ${error}`);
                }
            }
    } else {
        while(count<4){
            const checkFile = path.join(__dirname, "../OutputData/check.txt");
            const data = fs.readFileSync(checkFile, 'utf-8');
            let fileNameToCheck = `Emails${count}.txt`;
            if(data.includes(fileNameToCheck)){
                console.log(`${fileNameToCheck} is present in the file`);
                count+=1
            } else {
                const comapaniesEmailspath = path.join(__dirname, `../OutputData/Emails${count}.txt`);
                const companiesEmails = fs.readFileSync(comapaniesEmailspath, 'utf-8');
                const companiesEmailsJson = JSON.parse(companiesEmails)
                let emailCount = 1
                const resumeAttachment = path.join(__dirname, '../InputData/yrsk_mit_resume_9.pdf')
                for (const [email, value] of Object.entries(companiesEmailsJson)) {
                    const template = EmailTemplate();
                    try {
                        if (email !== "") {
                            regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                            if (!regex.test(email)) {
                                break
                            }
                            await new Promise(resolve => setTimeout(resolve, 5000));
                            await sendEmail(email, template, resumeAttachment);
                            console.log(`${emailCount++} ${email}`);
                        }
                    } catch (error) {
                        console.error(`Error sending email to ${email}: ${error}`);
                    }
                }
                // const template = EmailTemplate();
                // sendEmail("sakeerth.s12@gmail.com", template, path.join(__dirname, '../InputData/yrsk_mit_resume_9.pdf'))
                let appendfilepath = path.join(__dirname, `../OutputData/check.txt`);
                fs.appendFileSync(appendfilepath, `\n${fileNameToCheck}`);
                break
            }
            
        }
    }
}

function sendEmail(mail, template, attachmentPath, callback) {
    const subject = "Enthusiastic Inquiry for Software Development Opportunity";
    const email = process.env.EMAIL
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: email,
            pass: process.env.PASSWORD,
        },
    });

    var attachment = fs.readFileSync(attachmentPath);

    var mailOptions = {
        from: email,
        to: mail,
        replyTo: email,
        subject: subject,
        html: template,
        attachments: [
            {
                filename: process.env.PDF,
                content: attachment
            }
        ]
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            callback(false);
        } else {
            console.log("Email sent: " + info.response);
            callback(true);
        }
    });
}

module.exports = {
    extractEmailsFromFile,
    SendEmailsToCompanies
}