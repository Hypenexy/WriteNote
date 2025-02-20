// Import module with ES6 syntax
const { ConsoleManager, OptionPopup, InputPopup, PageBuilder, ButtonPopup, ConfirmPopup } = require('console-gui-tools')
const GUI = new ConsoleManager({
    title: 'TCP Simulator', // Title of the console
    logsPageSize: 8, // Number of lines to show in logs page
    changeLayoutKey: 'ctrl+l', // Change layout with ctrl+l to switch to the logs page
})

// Creating a main page updater:
const updateConsole = async() => {
    const p = new PageBuilder()
    p.addRow({ text: `TCP server simulator app! Welcome...`, color: 'yellow' })
    p.addRow({ text: `TCP Server listening on ${HOST}:${PORT}`, color: 'green' })
    p.addRow({ text: `Connected clients:`, color: 'green' }, { text: ` ${connectedClients}`, color: 'white' })
    p.addRow({ text: `TCP messages sent:`, color: 'green', bg: 'bgRed', bold: true, italic: true, underline: true }, { text: ` ${tcpCounter}`, color: 'white' })

    // Print if simulator is running or not
    if (!valueEmitter) {
        p.addRow({ text: `Simulator is not running! `, color: 'red' }, { text: `press 'space' to start`, color: 'white' })
    } else {
        p.addRow({ text: `Simulator is running! `, color: 'green' }, { text: `press 'space' to stop`, color: 'white' })
    }

    // Print mode:
    p.addRow({ text: `Mode: `, color: 'cyan' }, { text: `${mode}`, color: 'white' })
        // Print message frequency:
    p.addRow({ text: `Message period: `, color: 'cyan' }, { text: `${period} ms`, color: 'white' })
        // Print Min and Max
    p.addRow({ text: `Min: `, color: 'cyan' }, { text: `${min}`, color: 'white' })
    p.addRow({ text: `Max: `, color: 'cyan' }, { text: `${max}`, color: 'white' })
        // Print current values:
    p.addRow({ text: `Values: `, color: 'cyan' }, { text: ` ${values.map(v => v.toFixed(4)).join('   ')}`, color: 'white' })

    // Spacer
    p.addSpacer()

    if (lastErr.length > 0) {
        p.addRow({ text: lastErr, color: 'red' })
        p.addSpacer(2)
    }

    p.addRow({ text: "Commands:", color: 'white', bg: 'black' })
    p.addRow({ text: `  'space'`, color: 'gray', bold: true }, { text: `   - Start/stop simulator`, color: 'white', italic: true })
    p.addRow({ text: `  'm'`, color: 'gray', bold: true }, { text: `       - Select simulation mode`, color: 'white', italic: true })
    p.addRow({ text: `  's'`, color: 'gray', bold: true }, { text: `       - Select message period`, color: 'white', italic: true })
    p.addRow({ text: `  'h'`, color: 'gray', bold: true }, { text: `       - Set max value`, color: 'white', italic: true })
    p.addRow({ text: `  'l'`, color: 'gray', bold: true }, { text: `       - Set min value`, color: 'white', italic: true })
    p.addRow({ text: `  'q'`, color: 'gray', bold: true }, { text: `       - Quit`, color: 'white', italic: true })

    GUI.setPage(p)
}

GUI.on("exit", () => {
    closeApp()
})

// And manage the keypress event from the library
GUI.on("keypressed", (key) => {
    switch (key.name) {
    case "space":
        if (valueEmitter) {
            clearInterval(valueEmitter)
            valueEmitter = null
        } else {
            valueEmitter = setInterval(frame, period)
        }
        break
    case "m":
        new OptionPopup({
            id: "popupSelectMode", 
            title: "Select simulation mode", 
            options: modeList, 
            selected: mode 
        }).show().on("confirm", (_mode) => {
            mode = _mode
            GUI.warn(`NEW MODE: ${mode}`)
            drawGui()
        })
        break
    case "s":
        new OptionPopup({
            id: "popupSelectPeriod", 
            title: "Select simulation period", 
            options: periodList, 
            selected: period 
        }).show().on("confirm", (_period) => {
            const msgMultiLine = `Changing period from ${period} to ${_period} ms.${EOL}This will restart the simulator.${EOL}Do you want to continue?`
            new ButtonPopup({
                id: "popupConfirmPeriod", 
                title: "Confirm period", 
                message: msgMultiLine, 
                buttons: ["Yes", "No", "?"]
            }).show().on("confirm", (answer) => {
                if (answer === "Yes") {
                    period = _period
                    GUI.warn(`NEW PERIOD: ${period}`)
                } else if (answer === "?") {
                    GUI.info("Choose ok to confirm period")
                }
                drawGui()
            })
        })
        break
    case "h":
        new InputPopup({
            id: "popupTypeMax", 
            title: "Type max value", 
            value: max,
            numeric: true
        }).show().on("confirm", (_max) => {
            max = _max
            GUI.warn(`NEW MAX VALUE: ${max}`)
            drawGui()
        })
        break
    case "l":
        new InputPopup({
            id: "popupTypeMin", 
            title: "Type min value", 
            value: min, 
            numeric: true
        }).show().on("confirm", (_min) => {
            min = _min
            GUI.warn(`NEW MIN VALUE: ${min}`)
            drawGui()
        })
        break
    case "1":
        {
            const p = new PageBuilder(5) // Add a scroll limit so it will be scrollable with up and down
            p.addRow({ text: "Example of a custom popup content!", color: "yellow" })
            p.addRow({ text: "This is a custom popup!", color: "green" })
            p.addRow({ text: "It can be used to show a message,", color: "green" })
            p.addRow({ text: "or to show variables.", color: "green" })
            p.addRow({ text: "TCP Message sent: ", color: "green" }, { text: `${tcpCounter}`, color: "white" })
            p.addRow({ text: "Connected clients: ", color: "green" }, { text: `${connectedClients}`, color: "white" })
            p.addRow({ text: "Mode: ", color: "green" }, { text: `${mode}`, color: "white" })
            p.addRow({ text: "Message period: ", color: "green" }, { text: `${period} ms`, color: "white" })
            new CustomPopup({
                id: "popupCustom1", 
                title: "See that values", 
                content: p, 
                width: 32
            }).show()
        }
        break
    case "f":
        new FileSelectorPopup({
            id: "popupFileManager", 
            title: "File Manager", 
            basePath: "./"
        }).show()
        break
    case "q":
        new ConfirmPopup({
            id: "popupQuit", 
            title: "Are you sure you want to quit?"
        }).show().on("confirm", () => closeApp())
        break
    default:
        break
    }
})

const drawGui = () => {
    updateConsole()
}
