const https = require('https');
const fs = require('fs');
const datafile = require("./final.json");
const cors = require("cors");
const express = require("express");
const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.get("/nldata", (req, res) => {
    res.status(200).send(datafile);
});


app.listen(PORT, () => console.log(`Server is live on http://localhost:${PORT}`));