const https = require('https');
const fs = require('fs');
const datafile = require("./final.json");
const cors = require("cors");
const express = require("express");
const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    // res.send("To access the Netherlands data, proceed add /nldata to your URL");
    res.send(datafile);
});

app.listen(PORT, () => console.log(`Server is live on http://localhost:${PORT}`));