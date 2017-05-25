function readFile() {
    var url = "http://138.68.25.50:7398";    
    var selectedFile = document.getElementById('fileSelector').files[0];

    //var div = document.createElement('div');
    var newImageDiv = document.createElement("IMG");
    console.log(selectedFile['name']);
    var imgName = selectedFile['name'];
    //console.log(imgName);
    //console.log(selectedFile);

    var fr = new FileReader();
    fr.onload = function() {
        newImageDiv.src = fr.result;
       // console.log(newImageDiv.src);
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
    div.setAttribute("class","photo");
    div.setAttribute("id",imgName.substr(0,imgName.length-4));
    //div.setAttribute("onclick", "getLabels('"+imgName.substr(0,imgName.length-4)+"')");
    var textDiv = document.createElement('div');
    textDiv.setAttribute("class","labels");
    textDiv.setAttribute("id","labels"+imgName.substr(0,imgName.length-4));

    var newImageDiv = document.createElement("IMG");

    var menuButton = document.createElement('div');
    menuButton.setAttribute("class","menu");
    menuButton.setAttribute("id","menu"+imgName.substr(0,imgName.length-4));
    var menuPath = url+"/optionsTriangle.png";
    var menuImage = document.createElement("IMG");

    menuImage.setAttribute("src",menuPath);



    

    var fr = new FileReader();
    fr.onload = function() {
    newImageDiv.src = fr.result;
    //console.log(newImageDiv.src);
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
    //append photo image to photo div
    document.getElementById(imgName.substr(0,imgName.length-4)).appendChild(newImageDiv); 
    //append label text to photo div
    document.getElementById(imgName.substr(0,imgName.length-4)).appendChild(textDiv); 
    //append menu to photo div
    document.getElementById(imgName.substr(0,imgName.length-4)).appendChild(menuButton);
    //append menu image to menu div 
    document.getElementById("menu"+imgName.substr(0,imgName.length-4)).appendChild(menuImage);


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

function dropDown(){
    
}

function getLabels(imgName) {
        // construct url for query
    console.log(imgName);
    var url = "http://138.68.25.50:7398/query?img="+imgName;
    console.log(url);
        // becomes method of request object oReq
    function reqListener () {
        var pgh = document.getElementById("labels"+imgName);
        pgh.textContent = this.responseText;
    }

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    oReq.send();
}