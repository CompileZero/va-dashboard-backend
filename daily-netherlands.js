const fs = require("fs");
let JSONStream = require("JSONStream");
let es = require("event-stream");
const { Http2ServerRequest } = require("http2");

let today = new Date();

// let writeStream = fs.createWriteStream("yesterdays-data.json");

const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
yesterdayString = yesterday.toISOString().split("T")[0];

finalDataObj = [];

downloadData = (path, fileName) => {
    const file = fs.createWriteStream(fileName);

    const request = https.get(path, function (response) {
        response.pipe(file);
        console.log("Done with Download!");
    });
};

// downloadData("https://data.rivm.nl/covid-19/COVID-19_aantallen_gemeente_cumulatief.json", "../nl_data.json");

fs.createReadStream("../nl_data.json").pipe(JSONStream.parse('*')).on("data", function (dataObj) {
    // console.log(dataObj);
    if (dataObj["Date_of_report"] == `${yesterdayString} 10:00:00`) {
        finalDataObj.push(dataObj);

    }
}).on("end", function () {
    fs.writeFile("final.json", JSON.stringify(finalDataObj), { encoding: "utf-8" }, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Done!");
        }
    });


});