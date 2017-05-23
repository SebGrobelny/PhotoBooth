function readFile() {
    var url = "http://138.68.25.50:10754";    
    var selectedFile = document.getElementById('fileSelector').files[0];

    var newImageDiv = document.createElement("IMG");
    console.log(selectedFile);

    var fr = new FileReader();
    fr.onload = function() {
        newImageDiv.src = fr.result;
        console.log(newImageDiv.src);
    };

  
    var formData = new FormData();
    // anonymous callback uses file as image source
    formData.append("userfile", selectedFile);

    var oReq = new XMLHttpRequest();
    
     oReq.open("POST", url, true);
    oReq.onload = function() {
    console.log(oReq.responseText);
    }

    oReq.send(formData);

    var newImageDiv = document.createElement("IMG");
    

    var fr = new FileReader();
    fr.onload = function() {
    newImageDiv.src = fr.result;
    console.log(newImageDiv.src);
    }; 
    
    fr.readAsDataURL(selectedFile);
    newImageDiv.setAttribute("src", newImageDiv.src);
    newImageDiv.setAttribute("width", "500");
    newImageDiv.setAttribute("height", "500");
    document.getElementById("photoBody").appendChild(newImageDiv); 
}

function fadeImage() {
    var image = document.getElementById('theImage');
    var button = document.getElementById('fadeButton');
    if (button.textContent == 'Fade') {
    image.style.opacity = 0.5;
    button.textContent = 'UnFade';
    } 
    
    else {
    image.style.opacity = 1.0;
    button.textContent = 'Fade';
    }
}