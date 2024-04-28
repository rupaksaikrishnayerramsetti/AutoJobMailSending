const express = require('express');
const app = express();
const port = 8030;
const {extractEmailsFromFile, SendEmailsToCompanies} = require("./Utility/DataUtility")

const response = extractEmailsFromFile();
if(response) {
    SendEmailsToCompanies();
}

app.listen(port, () => console.log(`Server Started at port ${port}`));