const sharp = require('sharp');
const fs = require('fs');
const readline = require('readline');


const sql = require("./../databases/mysql");

const folder = "./assets/images/weather";
const folderImages = "./assets/images/weather/fullResolution";
const filenames = fs.readdirSync(folderImages);

(async() => {
    for (let i = 0; i < filenames.length; i++) {
        const element = filenames[i];
        var imageData = fs.readFileSync(`${folderImages}/${element}`);
        sharp(imageData)
            .resize({width: 600})
            .toFile(`${folder}/${element}`, (err) => {
                if(err){
                    console.log(`\x1b[31mError occured on ${element}: ` + err);
                }
            });
        
        // Console is unreliable
        // const rl = readline.createInterface({
        //     input: process.stdin,
        //     // output: process.stdout
        // });
        // const answer = await new Promise(resolve => {
        //     console.log(element + " [TimeMin] [TimeMax] [TemperatureMin] [TemperatureMax] [WeatherType]\n");
        //     rl.question(element + "", resolve);
        // });

        // if(answer){
        //     var answerSplit = answer.split(' ');
        //     console.log(answerSplit);
    
        //     sql.midelightDB.query(`INSERT INTO weatherimages 
        //         (ID, TimeMin, TimeMax, TemperatureMin, TemperatureMax, WeatherType) VALUES
        //         ('${element}', '${answerSplit[0]}', '${answerSplit[1]}', '${answerSplit[2]}', '${answerSplit[3]}', '${answerSplit[4]}')
        //     `);
        // }

        
    }
    async function processLineByLine() {
        const fileStream = fs.createReadStream(`${folderImages}/weatherData.txt`);
    
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
    
        var i = 0;
        for await (const line of rl) {
            var element = filenames[i];
            var data = line.split(' ');
            sql.midelightDB.query(`INSERT INTO weatherimages 
                (ID, TimeMin, TimeMax, TemperatureMin, TemperatureMax, WeatherType) VALUES
                ('${element}', '${data[0]}', '${data[1]}', '${data[2]}', '${data[3]}', '${data[4]}')
            `);
            i++;
        }
    }
    
    processLineByLine();
})();