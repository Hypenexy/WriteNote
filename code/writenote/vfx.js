notearea.addEventListener("blur", function(){
    header.classList.add("headeractive")
})
notearea.addEventListener("focus", function(){
    header.classList.remove("headeractive")
})


//cool looking filter, might add into mobile menu later ;)
//filter: contrast(1.5)brightness(1)sepia(1);