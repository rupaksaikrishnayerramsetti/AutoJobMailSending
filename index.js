const express = require('express');
const app = express();
const dotenv = require('dotenv')
dotenv.config()
const port = process.env.PORT;
const {extractEmailsFromFile, SendEmailsToCompanies} = require("./Utility/DataUtility")

const response = extractEmailsFromFile();
if(response) {
    SendEmailsToCompanies();
}

app.listen(port, () => console.log(`Server Started at port ${port}`));