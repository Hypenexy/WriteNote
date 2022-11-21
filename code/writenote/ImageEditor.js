var ImageEditor = document.createElement("ImageEditor")
app.appendChild(ImageEditor)

function openimageEditor(img, image){
    function closeEditor(){
        ImageEditor.style = ""
        img.style = ""
        image.appendChild(img)
        ImageEditor.innerHTML = ""
    }
    var HideModal = ShowModal(closeEditor, "#000000bb")

    var tools1 = document.createElement("tools1")
    tools1.innerHTML = "<i class='m-i'>edit</i><i class='m-i'>crop</i><i class='m-i'>fullscreen</i><i class='m-i'>share</i>"
    ImageEditor.appendChild(tools1)

    ImageEditor.appendChild(img)
    var info = document.createElement("info")
    var allMetaData
    EXIF.getData(img, function(){
        allMetaData = EXIF.getAllTags(this)
        //JSON.stringify(allMetaData, null, "\t")
        console.log(allMetaData)
    })
    if(Object.keys(allMetaData).length != 0){
        info.innerHTML = "<p><i class='m-i'>event</i> " + allMetaData.DateTime + "</p>"+
        "<p><i class='m-i'>photo_size_select_large</i> " + allMetaData.PixelXDimension + " x " + allMetaData.PixelYDimension +
        " f/" + allMetaData.FNumber +
        " " + allMetaData.FocalLength + "mm" +
        " 1/" + 1/allMetaData.ExposureTime +
        " sec ISO " + allMetaData.ISOSpeedRatings +
        " " + allMetaData.XResolution + " dpi" +//show file size in base64 as well!
        //" " + allMetaData.bit + " bit" + what
        "</p>"+
        "<p><i class='m-i'>photo_camera</i> " + allMetaData.Make + " " + allMetaData.Model + "</p>"
    }
    else{
        info.innerHTML = "<p><i class='m-i'>photo_size_select_large</i> " + img.naturalWidth + " x " + img.naturalHeight;
    }
    ImageEditor.appendChild(info)

    ImageEditor.style.visibility = "visible"
    ImageEditor.style.opacity = 1

    EditorImgResize(img)
}

function EditorImgResize(img){
    if(window.innerWidth>img.naturalWidth + 300){
        img.style.position = "absolute"
        img.style.left = img.naturalWidth + "px"
        img.style.width = img.naturalWidth + "px"
    }
    else{
        img.style = ""
    }
}

window.addEventListener("resize", function(){
    if(ImageEditor.innerHTML){
        EditorImgResize(ImageEditor.getElementsByTagName("img")[0])
    }
})