	function openpanels(panel){
    if(panel=="open"){
      if(loggedin==true){
        document.getElementById("opensection").style.display = "block";
        document.getElementById("uploadsection").style.display = "none";
        document.getElementById("opensectionbtn").classList.add("openselected");
        document.getElementById("uploadsectionbtn").classList.remove("openselected");
      }
      else{
        SendTooltip("You must be logged in to do that.", "warn")
      }
    }
    if(panel=="upload"){
      document.getElementById("uploadsection").style.display = "block";
      document.getElementById("opensection").style.display = "none";
      document.getElementById("uploadsectionbtn").classList.add("openselected");
      document.getElementById("opensectionbtn").classList.remove("openselected");
    }
    if(panel=="recent"){
      document.getElementById("recentsection").style.display = "block";
      document.getElementById("opensection").style.display = "none";
      //add the others as well!
      document.getElementById("recentsectionbtn").classList.add("openselected");
      document.getElementById("opensectionbtn").classList.remove("openselected");
    }
  }
  
  document.getElementById("opensection").style.display = "block";
  document.getElementById("uploadsection").style.display = "none";
  document.getElementById("opensectionbtn").classList.add("openselected");
  document.getElementById("uploadsectionbtn").classList.remove("openselected");

  function loadFile(uploadedfile)
	{
		var name = uploadedfile.name;
		var reader = new FileReader();
	    reader.onloadend = function(evt) {
	    	if( evt.target.readyState==FileReader.DONE ) {
          
	    		s = evt.target.result;

	    		notearea.value = s;

          if( name=='' )
            document.title = 'WriteNote';
          else
            document.title = name + ' - WriteNote';
      	}
    	};
		reader.readAsText(uploadedfile);
    hideAll();
	}

  function loadSpecificFile()
	{
		var name = fileElem.files[0].name;
		var reader = new FileReader();
	    reader.onloadend = function(evt) {
	    	if( evt.target.readyState==FileReader.DONE ) {
          
	    		s = evt.target.result;

	    		notearea.value = s;

          if( name=='' )
            document.title = 'WriteNote';
          else
            document.title = name + ' - WriteNote';
      	}
    	};
		reader.readAsText(fileElem.files[0]);
    hideAll();
	}

  document.getElementById("dropContainer").ondragover = document.getElementById("dropContainer").ondragenter = function(evt) {
    evt.preventDefault();
  };

  document.getElementById("dropContainer").ondrop = function(evt) {
    if(evt.dataTransfer.files[0]){
      evt.preventDefault();
      loadFile(evt.dataTransfer.files[0]);
    }
    //var file = evt.dataTransfer.files[0],
    //reader = new FileReader();
    //reader.onload = function(event) {
    //    console.log(event.target);
    //};
    //console.log(file);
    //reader.readAsText(file);
  };
  document.getElementById("notearea").ondrop = function(evt) {
    if(evt.dataTransfer.files[0]){
      evt.preventDefault();
      loadFile(evt.dataTransfer.files[0]);
    }
  };