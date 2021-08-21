const fs = require("fs");
const https = require("https");
let JSONStream = require("JSONStream");
let es = require("event-stream");
const { Http2ServerRequest } = require("http2");


function getPastDates() {

    let listOfDates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
        today.setDate(today.getDate() - 1);
        dayString = today.toISOString().split("T")[0];
        listOfDates.push(`${dayString} 10:00:00`);
    }
    return listOfDates;
}

let listOfDates = getPastDates();
console.log(listOfDates);

let finalDataObj = {};
let finalArrayObj = [];

downloadData = (path, fileName) => {
    const file = fs.createWriteStream(fileName);

    const request = https.get(path, function (response) {
        response.pipe(file);
        console.log("Done with Download!");
    });
};

// downloadData("https://data.rivm.nl/covid-19/COVID-19_aantallen_gemeente_cumulatief.json", "../nl_data.json");

function writeData() {

    fs.createReadStream("../nl_data.json").pipe(JSONStream.parse('*')).on("data", function (dataObj) {
        // console.log(dataObj);
        let municipalityName = dataObj["Municipality_name"];
        let municipalityObject = { municipalityName: [] };
        if (listOfDates.includes(dataObj["Date_of_report"])) {
            if (!finalDataObj[municipalityName]) {
                finalDataObj[municipalityName] = [];
            }
            finalDataObj[municipalityName].push({ "Date_of_report": dataObj["Date_of_report"], "Total_reported": dataObj["Total_reported"], "Hospital_admission": dataObj["Hospital_admission"], "Deceased": dataObj["Deceased"] });
        }
    }).on("end", function () {

        for (const key in finalDataObj) {
            let updatedObj = {
                "Municipality_name": key,
                "History_data": finalDataObj[key]
            };
            finalArrayObj.push(updatedObj);
        }

        fs.writeFile("final.json", JSON.stringify(finalArrayObj), { encoding: "utf-8" }, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Done!");
            }
        });
    });
}

writeData();