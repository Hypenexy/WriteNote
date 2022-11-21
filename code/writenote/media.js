var media = document.createElement("media")
media.innerHTML = "<h1><i class='m-i'>folder</i>Media</h1><x class='m-i'>close</x>"

ButtonEvent(media.getElementsByTagName("x")[0], hidemedia)

app.appendChild(media)
var mediamodal

function showmedia(){
    mediamodal = ShowModal(hidemedia)
    media.classList.add('mediaactive')
}

function hidemedia(){
    media.classList.remove('mediaactive')
    mediamodal()
}

//here show all neats like added date file creation date. if the file is shared, the option to share and comments maybe!

//maybe u can store images in css?
//dunno