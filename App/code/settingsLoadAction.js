var onsettingsloadActions = [];

function loadedSettings(){
    var userKeys = Object.keys(settings);
    var appKeys = Object.keys(settings_keys);
    for (let i = 0; i < userKeys.length; i++) {
        const userSection = userKeys[i];
        for (let i = 0; i < appKeys.length; i++) {
            const appSection = appKeys[i];
            if(userSection == appSection){
                var userSettings = Object.keys(settings[userSection])
                for (let i = 0; i < userSettings.length; i++) {
                    const element = userSettings[i];
                    if(settings_keys[userSection].settings[element].type == "toggle"){
                        settings_keys[userSection].settings[element].action(true);
                    }
                }
            }   
        }
        
    }


    for (let i = 0; i < onsettingsloadActions.length; i++) {
        onsettingsloadActions[i]();
    }
}