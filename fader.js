function readFile() {
    var url = "http://138.68.25.50:7398";    
    var selectedFile = document.getElementById('fileSelector').files[0];

    //var div = document.createElement('div');
    var newImageDiv = document.createElement("IMG");
    console.log(selectedFile['name']);
    var imgName = selectedFile['name'];
    console.log(imgName);
    console.log(selectedFile);

    var fr = new FileReader();
    fr.onload = function() {
        newImageDiv.src = fr.result;
        console.log(newImageDiv.src);
    };

    //newImageDiv.src = imgName;
  
    var formData = new FormData();
    // anonymous callback uses file as image source
    formData.append("userfile", selectedFile);

    var oReq = new XMLHttpRequest();
    
     oReq.open("POST", url, true);
    oReq.onload = function() {
    console.log(oReq.responseText);
    }

    oReq.send(formData);

    var div = document.createElement('div');
    div.setAttribute("id",imgName.substr(0,imgName.length-4));
    //div.setAttribute("onclick", "getLabels('"+imgName.substr(0,imgName.length-4)+"')");
    var textDiv = document.createElement('div');
    textDiv.setAttribute("id",imgName.substr(0,imgName.length-4)+'text');

    var newImageDiv = document.createElement("IMG");
    

    var fr = new FileReader();
    fr.onload = function() {
    newImageDiv.src = fr.result;
    console.log(newImageDiv.src);
    }; 
    
    fr.readAsDataURL(selectedFile);
    newImageDiv.src = imgName;
    newImageDiv.setAttribute("src", newImageDiv.src);
    console.log(newImageDiv.src);
    newImageDiv.setAttribute("alt", selectedFile['name']);
    newImageDiv.setAttribute("width", "500");
    newImageDiv.setAttribute("height", "500");

    textDiv.textContent  = getLabels(imgName.substr(0,imgName.length-4));

    document.getElementById("photoBody").appendChild(div);
    document.getElementById(imgName.substr(0,imgName.length-4)).appendChild(newImageDiv); 
    document.getElementById(imgName.substr(0,imgName.length-4)).appendChild(textDiv); 

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

function getLabels(imgName) {
        // construct url for query
    console.log(imgName);
    var url = "http://138.68.25.50:7398/query?img="+imgName;
    console.log(url);
        // becomes method of request object oReq
    function reqListener () {
        var pgh = document.getElementById("labels");
        pgh.textContent = this.responseText;
    }

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    oReq.send();
}