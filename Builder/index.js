// Console Interface
function log(){
    if(arguments[0]=="s"){
        arguments[0] = "\x1b[32m%s\x1b[0m";
    }
    if(arguments[0]=="f"){
        arguments[0] = "\x1b[31m%s\x1b[0m";
    }
    if(arguments[0]=="server"){
        arguments[0] = "\x1b[34m\x1b[1mServer:\x1b[0m %s\x1b[0m";
        if(arguments[1]=="user"){
            arguments[1] = "\x1b[35mUser";
            arguments[2] = "\x1b[35m\x1b[1m" + arguments[2] + "\x1b[0m";
        }
    }
    console.log.apply(console, arguments);
}

const colors = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    blue: "\x1b[34m",
    purple: "\x1b[35m",
    reset: "\x1b[0m",
}

// import os from "os";
// import readline from "readline";
const os = require("os");
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
console.log();
console.log("\x1b[34m WriteNote Builder");
console.log("\x1b[34m Version: \x1b[35m" + process.env.npm_package_version);
console.log();
console.log("\x1b[34m Commands:");
console.log("\x1b[35m  Build (1) [Version]");
console.log("\x1b[35m  Status (2)");
console.log("\x1b[35m  Clean (3)");
console.log("\x1b[35m  Exit (4)");
console.log(colors.reset);

function commandInterface(){
    rl.question("", function(command) {
        var commandMatched = false;
        command = command.trim().toLowerCase();
        const commands = command.split(' ');
        if(commands[0] == "build" || commands[0] == 1){
            commandMatched = true;
            if(commands.length > 1){
                build(commands[1]);
            }
            else{
                build();
            }
        }
        if(command == "status" || command == 2){
            commandMatched = true;
            status();
        }
        if(command == "clean" || command == 3){
            commandMatched = true;
            clean();
        }
        if(command == "exit" || command == 4){
            commandMatched = true;
            rl.close();
        }
        if(commandMatched == false){
            console.log(`${colors.red}Command not found${colors.reset}`);
        }
        commandInterface();
    });
}

commandInterface();

rl.on("close", function(){
    process.exit(0);
});


const fs = require("fs");
// import fs from 'fs';

// import minify from '@node-minify/core';
// import babelMinify from '@node-minify/babel-minify';
// import uglifyJS from '@node-minify/uglify-js';
// import cleanCSS from '@node-minify/clean-css';
const UglifyJS = require("uglify-js");
const CleanCSS = require('clean-css');

const appFolder = "../App/", 
    codeFolder = `${appFolder}code/`,
    styleFolder = `${appFolder}style/`,
    assetsFolder = `${appFolder}assets/`;
function build(version){
    var dir = "./dst/WriteNoteApp/";
    if(version){
        dir += version;
    }
    else{
        dir += "1.0.0";
    }

    if(fs.existsSync(dir)){
        console.log(`${colors.red}Version already exists!${colors.reset}`);
        return;
    }

    const index = fs.readFileSync("../App/index.html", 'utf-8');

    fs.mkdirSync(dir, { recursive: true });
    fs.mkdirSync(`${dir}/dst`);

    // function combineInOne(folder){
    //     var combination = "";
    //     const files = fs.readdirSync(folder);
    //     files.forEach(filename => {
    //         const path = folder + filename;
    //         if(fs.lstatSync(path).isDirectory()){
    //             return;
    //         }
    //         combination += fs.readFileSync(path, 'utf-8');
    //     });

    //     return combination;
    // }
    // const code = combineInOne(codeFolder);
    // console.log(code);
    // fs.writeFileSync(`${dir}/code.js`, code);

    const codeRegex = /(?<!- )<script.*?src="(.*?)"/g,
        styleRegex = /(?<!- )<link rel="stylesheet" .*?href="(.*?)"/g;
    function getFiles(newFile, regex, compressor){
        const files = index.matchAll(regex);
        var combination = "";
        for (const file of files) {
            const filename = file[1];
            const path = appFolder + filename;
            
            if(fs.lstatSync(path).isDirectory()){
                return;
            }
            combination += fs.readFileSync(path, 'utf-8') + "\n";
        }
        // minify({
        //     compressor: compressor,
        //     content: combination,
        //     options: {
        //       warnings: false
        //     },
        // }).then(function (minified){
        //     fs.writeFileSync(`${dir}/${newFile}`, minified);
        // });
        var minified = " ";
        if(compressor == "uglifyJS"){
            const options = {
                sourceMap: {
                    filename: "out.js",
                    url: "out.js.map"
                }
            };
            minified = UglifyJS.minify(combination, options).code;
        }
        if(compressor == "cleanCSS"){
            const options = {}; 
            minified = new CleanCSS(options).minify(combination).styles;
        }
        fs.writeFileSync(`${dir}/dst/${newFile}`, minified);
    }

    getFiles("code.js", codeRegex, "uglifyJS");
    getFiles("style.css", styleRegex, "cleanCSS");


    fs.cpSync(assetsFolder, `${dir}/assets/`, { recursive: true });

    const newIndex = `<!DOCTYPE html><html style="background:#111"lang="en"><head><meta charset="UTF-8"><meta name="viewport"content="width=device-width,initial-scale=1.0"><title>WriteNote</title><link rel="stylesheet"href="dst/style.css"></head><body><script src="dst/code.js"></script></body></html>`;
    fs.writeFileSync(`${dir}/index.html`, newIndex, {encoding: "utf-8"});

    fs.copyFileSync(`${appFolder}favicon.ico`, `${dir}/favicon.ico`);

    console.log(`${colors.green}Version successfully built!${colors.reset}`);
}

function fileCount(){
    var dir = "./dst/WriteNoteApp/";
    log('s', dir)
    if(!fs.existsSync(dir)){
        return `no versions`;
    }
    var dir = "./dst/WriteNoteApp/";
    const count = fs.readdirSync(dir).length;
    const countstr = count > 1 ? "s" : "";
    return `${count} version${countstr}`;
}

function status(){
    console.log(`${colors.green}You have ${fileCount()}.${colors.reset}`);
}

function clean(){
    var dir = "./dst/WriteNoteApp/";
    if(!fs.existsSync(dir)){
        console.log(`${colors.red}Already clean.${colors.reset}`);
        return;
    }
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`${colors.red}All ${fileCount()} successfully cleaned!${colors.reset}`);
}

function twirlTimer(){
    var P = ["\\", "|", "/", "-"];
    var x = 0;
    return setInterval(function() {
      process.stdout.write("\r" + P[x++]);
      x &= 3;
    }, 250);
};
  