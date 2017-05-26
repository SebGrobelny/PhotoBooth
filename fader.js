
var idNum = 0;

function readFile() {
    var url = "http://138.68.25.50:7398";    
    var selectedFile = document.getElementById('fileSelector').files[0];

    //var div = document.createElement('div');
    var newImageDiv = document.createElement("IMG");
    console.log(selectedFile['name']);
    var imgName = selectedFile['name'];
    var imgName = imgName.substr(0,imgName.length-4);
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
    div.setAttribute("id",imgName);
    //div.setAttribute("onclick", "getLabels('"+imgName.substr(0,imgName.length-4)+"')");
    var textDiv = document.createElement('div');
    textDiv.setAttribute("class","labels");
    textDiv.setAttribute("id","labels"+imgName);

    var newImageDiv = document.createElement("IMG");

    var menuButton = document.createElement('div');
    menuButton.setAttribute("class","menu");
    menuButton.setAttribute("id","menu"+imgName);

    var menuName = "menu"+imgName.substr(0,imgName.length-4);
    menuButton.setAttribute("onclick","generatedropDown('"+"dropDown"+imgName+"')");

    var menuPath = url+"/optionsTriangle.png";
    var menuImage = document.createElement("IMG");

    menuImage.setAttribute("src",menuPath);

    var menuDropDown = document.getElementById("myDropdown");
    //clone HTML element
    var menuDropDown = menuDropDown.cloneNode(true);
    menuDropDown.setAttribute("id", "dropDown"+imgName);

    var overlay = document.createElement('div');
    overlay.setAttribute("class","overlay"); 
    overlay.setAttribute("id","overlay"+imgName);




    

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
    newImageDiv.setAttribute("width", "250");
    newImageDiv.setAttribute("height", "300");

    textDiv.textContent  = getLabels(imgName);

    document.getElementById("photoBody").appendChild(div);
    document.getElementById(imgName).appendChild(overlay);
    //append photo image to photo div
    document.getElementById("overlay"+imgName).appendChild(newImageDiv);
    //document.getElementById(imgName).appendChild(newImageDiv);
    document.getElementById("overlay"+imgName).appendChild(menuButton); 
    //append label text to photo div
    document.getElementById(imgName).appendChild(textDiv); 
    
    //append menu image to menu div 
    document.getElementById("menu"+imgName).appendChild(menuImage);
    document.getElementById("menu"+imgName).appendChild(menuDropDown);


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

function generatedropDown(menuDropDownId){

    console.log(menuDropDownId);
   document.getElementById(menuDropDownId).classList.toggle("show");
    



}

function getLabels(imgName) {
        // construct url for query
    console.log(imgName);
    var url = "http://138.68.25.50:7398/query?type=getLabel&img="+imgName;
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