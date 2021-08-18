
import fs from "fs";
import https from "https";

function downloadData(path, fileName) {

    const file = fs.createWriteStream(fileName);

    const request = https.get(path, function (response) {
        response.pipe(file);
        console.log("Done with Download!");
    });

};


function readData() {
    let stream = fs.createReadStream("https://data.rivm.nl/covid-19/COVID-19_aantallen_gemeente_cumulatief.json", { flags: 'r', encoding: 'utf-8' });
    let buf = '';

    stream.on('data', function (chunk) {
        console.log(chunk);
    });
}

// readData();

function newCall() {
    let chunkCount = 1;
    let lastSubChunk = "";
    https.get("https://data.rivm.nl/covid-19/COVID-19_aantallen_gemeente_cumulatief.json", function (response) {
        response.on('data', function (chunk) {
            // console.log(chunk.toString());


            if (chunkCount === 1) {
                chunk = chunk.toString().substr(1);
                chunkCount += 1;
            }
            let subChunk = chunk.toString().split('},');

            subChunk.forEach(element => {
                if (element == subChunk[0]) {
                    lastSubChunk = lastSubChunk.concat(element).concat("}");
                    console.log(`This is the last sub chunk - ${lastSubChunk}`);
                    if (lastSubChunk.includes("},{")) {
                        let splitChunks = lastSubChunk.split("},");
                        splitChunks[0] = splitChunks[0].concat("}");
                        let splitChunk0 = JSON.parse(splitChunks[0]);
                        let splitChunk1 = JSON.parse(splitChunks[1]);
                        if (splitChunk0["Date_of_report"].includes("2021-08-09")) {
                            console.log(splitChunks[0]);
                        }
                        else if (splitChunk1["Date_of_report"].includes("2021-08-09")) {
                            console.log(splitChunks[1]);
                        }
                        lastSubChunk = "";
                    }
                    else {
                        let dataObj = JSON.parse(lastSubChunk);
                        if (dataObj["Date_of_report"].includes("2021-08-09")) {
                            console.log(lastSubChunk);
                        }
                        lastSubChunk = "";
                    }
                }
                else if (element == subChunk[subChunk.length - 1]) {
                    lastSubChunk = lastSubChunk.concat(element);
                }
                else {
                    element = element.concat("}");
                    console.log(element);
                    let dataObj = JSON.parse(element);
                    if (dataObj["Date_of_report"].includes("2021-08-09")) {
                        console.log("Hurrayy!");
                    }
                }
            });


            // console.log(`Sub Chunk 2 - ${sub_chunk2}`);
        });
        response.on('end', function () {
            console.log("Add Data Downloaded!");
        });

    });
}
// downloadData("https://data.rivm.nl/covid-19/COVID-19_aantallen_gemeente_cumulatief.json", "../nl_data.json");
// newCall();