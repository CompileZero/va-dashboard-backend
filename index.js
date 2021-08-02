const https = require('https');
const fs = require('fs');

const express = require("express");
const app = express();
const PORT = 8080;

app.use(express.json());

downloadData = (path, fileName) => {

    const file = fs.createWriteStream(fileName);

    const request = https.get(path, function (response) {
        response.pipe(file);
        console.log("Done with Download!");
    });

};

// downloadData("https://data.rivm.nl/covid-19/COVID-19_aantallen_gemeente_cumulatief.json", "nl_data.json");

let new_data = {
    1: "Hello",
    2: "Bye",
    3: "Good day",
    4: "Ok",
    5: "Byee",

};

app.get("/tshirt", (req, res) => {
    res.status(200).send({
        tshirt: 'tshirt',
        size: 'large'
    });
});

app.post("/tshirt/:id", (req, res) => {

    const { id } = req.params;
    const { logo } = req.body;

    if (!logo) {
        res.status(418).send({ message: "We need a logo!" });
    }

    res.send({
        new_data,
        tshirt: `tshirt with your ${logo} and ID ${id}`
    });
});

app.listen(PORT, () => console.log(`Its alive on http://localhost:${PORT}`));