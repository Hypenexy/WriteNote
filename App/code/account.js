function createInput(type, isLogin){
    const element = document.createElement("div");
    element.classList.add("label");

    const text = document.createElement("div");
    text.classList.add("text");
    element.appendChild(text);

    var errors = [];
    function appendError(textCode){
        for (let i = 0; i < errors.length; i++) {
            if(errors[i][0] == textCode){
                return;
            }
        }
        const element = document.createElement("span");
        element.classList.add("hide");
        element.textContent = locale[textCode];
        text.appendChild(element);
        errors.push([textCode, element]);
        setTimeout(() => {
            element.classList.remove("hide");
        }, 20);

    }
    function removeError(textCode){
        for (let i = 0; i < errors.length; i++){
            if(errors[i][0] == textCode){
                errors[i][1].classList.add("hide");
                setTimeout(() => {
                    errors[i][1].remove();
                    errors.splice(i, 1);
                }, 300);
            }
        }
    }

    const input = document.createElement("input");
    element.appendChild(input);

    if(type == "email"){
        text.textContent = locale.email;   
        input.type = "email";
        input.name = "email";
        input.autocomplete = "email";
    }
    if(type == "username"){
        if(isLogin){
            text.textContent = locale.username_or_email;
        }
        else{
            text.textContent = locale.username;   
        }
        input.type = "username";
        input.name = "fname";
    }
    if(type == "password"){
        text.textContent = locale.password;
        input.type = "password";
        input.name = "password";
        if(isLogin){
            input.autocomplete = "current-password";
        }
        else{
            input.autocomplete = "new-password";
        }

        const showPasswordButton = document.createElement("div");
        showPasswordButton.classList.add("button", "m-i", "passwordShow");
        showPasswordButton.textContent = "visibility";
        element.appendChild(showPasswordButton);
        mdutils.ButtonEvent(showPasswordButton, () => {
            if(showPasswordButton.textContent == "visibility"){
                showPasswordButton.textContent = "visibility_off";
                input.type = "text";
            }
            else{
                showPasswordButton.textContent = "visibility";
                input.type = "password";
            }
        });
    }

    // Moving placeholder
    input.addEventListener("input", () => {
        if(input.value.length > 0){
            text.classList.add("hide");
        }
        else{
            text.classList.remove("hide");
        }
    });

    // Selecting sibling elements with keyboard
    input.addEventListener("keydown", (e) => {
        if(e.key == "ArrowUp"){
            const previousElement = element.previousElementSibling.querySelector("input");
            if(previousElement){
                previousElement.focus();
            }
        }
        if(e.key == "Enter" || e.key == "ArrowDown"){
            if(element.nextElementSibling.classList.contains("button")){
                element.nextElementSibling.focus();
                return;
            };
            element.nextElementSibling.querySelector("input").focus();
        }
    });

    // Password warnings
    if(type == "password"){
        input.addEventListener("input", () => {
            if(errors.length > 0){
                removeError("empty");
                removeError("wrong_password");
                removeError("at_least_change");
                if(!input.value.startsWith(" ")){
                    removeError("starts_with_whitespace");
                }
                if(!input.value.endsWith(" ") || input.value.length <= 1){
                    removeError("ends_with_whitespace");
                }
            }
            if(input.value != ""){
                input.classList.add("hide");
            }
            else{
                input.classList.remove("hide");
            }
            if(input.value.startsWith(" ")){
                appendError("starts_with_whitespace");
            }
            if(input.value.endsWith(" ") && input.value.length > 1){
                appendError("ends_with_whitespace");
            }
        });

        input.addEventListener("keydown", (e) => {
            var caps = e.getModifierState && e.getModifierState('CapsLock');
            if(caps){
                appendError("caps_enabled");
            }
            else{
                removeError("caps_enabled");
            }
        });
    }

    // Email warnings
    if(type == "email"){
        input.addEventListener("input", () => {
            if(errors.length > 0){
                removeError("empty");
                removeError("email_invalid");
                removeError("email_taken");
            }
        });
        input.addEventListener("focusout", () => {
            if(input.value.length > 0){
                if(!mdutils.validateEmail(input.value)){
                    appendError("email_invalid");
                }
            }
        });
    }

    // Username warnings
    if(type == "username"){
        input.addEventListener("input", () => {
            if(errors.length > 0){
                removeError("empty");
                removeError("username_taken");
            }
            if(input.value.length > 30){
                appendError("username_too_long");
            }
            else{
                if(errors.length > 0){
                    removeError("username_too_long");
                }
            }
        });
    }

    // Validation and output
    element.validatedValue = () =>{
        if(input.value.length == 0){
            appendError("empty");
        }
        if(errors.length > 0){
            return;
        }
        return input.value;
    }

    // Just output
    element.value = () => {
        return input.value;
    }

    // Append server errors
    element.appendError = appendError;
    
    return element;
}

function createSignButton(action){
    const element = document.createElement("div");
    element.classList.add("button");
    mdutils.ButtonEvent(element, action);

    element.addEventListener("keydown", (e) => {
        if(e.key == "ArrowUp"){
            const previousElement = element.previousElementSibling.querySelector("input");
            if(previousElement){
                previousElement.focus();
            }
        }
    });

    return element;
}

function createRegisterMenu(){
    const element = document.createElement("div");
    element.classList.add("register");
    const mdblock = document.createElement("div");
    mdblock.classList.add("mdblock");
    element.appendChild(mdblock);
    
    const welcomeText = document.createElement("div");
    welcomeText.classList.add("welcomeText");
    welcomeText.textContent = locale.welcome_to;
    mdblock.appendChild(welcomeText);

    const trait = document.createElement("div");
    trait.classList.add("trait");
    mdblock.appendChild(trait);
    
    var traits = [
        locale.text_editor,
        locale.photo_editor,
        locale.calculator,
        locale.audio_player,
        locale.notes_app,
        locale.text_editor
    ];

    var animation_iterations = 0;
    trait.onanimationend = () => {
        animation_iterations++;
        if(animation_iterations == 5){
            return;
        }
        if(!trait.classList.contains("shortAnimations")){
            trait.classList.add("shortAnimations");
        }
        trait.classList.toggle("animate");
        trait.classList.toggle("animateAlt");
    }
    trait.classList.add("animate");
    mdutils.foreachDelayed(traits, (element) => {
        trait.textContent = element;
    }, 1500, true);

    function formElement(){
        const form = document.createElement("form");
        mdblock.appendChild(form);
        return form;
    }

    function signElement(){
        const text = document.createElement("div");
        text.classList.add("sign");
        return text;
    }

    function switchElements(form, locale1, locale2, action){
        const switchText = document.createElement("div");
        switchText.classList.add("switchText");
        switchText.textContent = locale1;
        form.appendChild(switchText);

        const switchbtn = document.createElement("div");
        switchbtn.classList.add("button");
        switchbtn.textContent = locale2;
        form.appendChild(switchbtn);

        mdutils.ButtonEvent(switchbtn, () => {
            form.classList.add("toabove");
            form.onanimationend = () =>{
                form.remove();
                form.onanimationend = "";
                action(true);
            };
        });
    }
    
    function createLogin(transition){
        const form = formElement();
        if(transition){
            form.classList.add("frombelow");
            form.onanimationend = () =>{
                form.classList.remove("frombelow");
            }
        }

        const text = signElement();
        text.textContent = locale.sign_in;
        form.appendChild(text);

        const usernameInput = createInput("username", true);
        form.appendChild(usernameInput);
        
        const passwordInput = createInput("password", true);
        form.appendChild(passwordInput);
        
        function submitLogin(){
            const username = usernameInput.value();
            const password = passwordInput.value();
            
            const data = {
                type: "login",
                identity: username,
                password: password,
                device: device
            }
            socket.emit("account", data, (response) => {
                if(typeof response != "object"){
                    console.log("Server responded with invalid data!");
                }
                if(response.error){
                    if(response.error == "Wrong username or password"){
                        usernameInput.appendError("wrong_credentials");
                    }
                }
                else{
                    console.log(response);
                    // socket.disconnect();
                    // socket.connect()
                }
            });
            
        }

        const signButton = createSignButton(submitLogin);
        signButton.textContent = locale.sign_in;
        form.appendChild(signButton);
        switchElements(form, locale.if_new, locale.create_account, createRegister);
    }
    
    function createRegister(transition){
        const form = formElement();
        if(transition){
            form.classList.add("frombelow");
            form.onanimationend = () => {
                form.classList.remove("frombelow");
            }
        }

        const text = signElement();
        text.textContent = locale.create_account;
        form.appendChild(text);

        const emailInput = createInput("email");
        form.appendChild(emailInput);

        const usernameInput = createInput("username");
        form.appendChild(usernameInput);
        
        const passwordInput = createInput("password");
        form.appendChild(passwordInput);

        function submitRegister(){
            const email = emailInput.validatedValue();
            const username = usernameInput.validatedValue();
            const password = passwordInput.validatedValue();
            if(email && username && password){
                const data = {
                    type: "register",
                    email: email,
                    username: username,
                    password: password,
                    device: device
                }
                socket.emit("account", data, (response) => {
                    console.log(response);
                    if(typeof response != "object"){
                        console.log("Server responded with invalid data!");
                    }
                    if(response.error){
                        if(response.error == "Email already taken"){
                            emailInput.appendError("email_taken");
                        }
                        if(response.error == "Username already taken"){
                            usernameInput.appendError("username_taken");
                        }
                    }
                });
            }
        }

        const signButton = createSignButton(submitRegister);
        signButton.textContent = locale.sign_up;
        form.appendChild(signButton);

        switchElements(form, locale.already_account, locale.sign_in, createLogin);
    }

    createRegister();
    return element;
}

function createAvatarElement(){
    
}