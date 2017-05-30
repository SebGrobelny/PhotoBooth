
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

    //textDiv.textContent  = getLabels(imgName);






    document.getElementById("photoBody").appendChild(div);

    document.getElementById(imgName).appendChild(overlay);
    //append photo image to photo div
    document.getElementById("overlay"+imgName).appendChild(newImageDiv);
    //document.getElementById(imgName).appendChild(newImageDiv);
    document.getElementById("overlay"+imgName).appendChild(menuButton); 

    //append label text to photo div
    document.getElementById(imgName).appendChild(textDiv);


    
    getLabels(imgName);



    // var labelStr = getLabels(imgName);

    // console.log(labelStr);

    // var subStr = labelStr.split(",");

    // for(i = 0; i < subStr.length(); i++)
    // {
    //     var labelName = subStr[i];
    //     var label = document.createElement('div');
    //     label.setAttribute("id", labelName);
    //     label.textContent = labelName;

    //     document.getElementById("labels"+imgName).appendChild(label);
    //    // var rmvIcon = document.createElement()

    // } 
    


 
    
    //append menu image to menu div 
    document.getElementById("menu"+imgName).appendChild(menuImage);
    document.getElementById("menu"+imgName).appendChild(menuDropDown);

    document.getElementsByClassName("change")[0].setAttribute("id","change"+imgName);
    document.getElementsByClassName("change")[0].setAttribute("onclick","generateTags('"+imgName+"')");
    document.getElementsByClassName("add")[0].setAttribute("id","add"+imgName);


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

function generateTags(imgName)
{
    var labelID = "labels"+imgName;
   console.log(labelID);
   var label = document.getElementById(labelID);

   var removeLength = label.getElementsByClassName("removeIcon").length;

   for( i=0; i < removeLength; i++)
   {
       // label.getElementsByClassName("removeIcon")[i].toggle("show");

        if (label.getElementsByClassName("removeIcon")[i].style.display === 'none') {
        label.getElementsByClassName("removeIcon")[i].style.display = 'block';
        } 
    else {
        label.getElementsByClassName("removeIcon")[i].style.display = 'none';
    }
   }

   var newlabelID = "newLabel"+imgName;
   console.log(newlabelID);
   if( document.getElementById(newlabelID).style.display === 'none')
   {
        document.getElementById(newlabelID).style.display = 'block';
   }
   else
   {
        document.getElementById(newlabelID).style.display = 'none';
   }
}

function setLabels(labelStr,imgName){
        var rmvUrl = "http://138.68.25.50:7398/removeTagButton.png";
       // var labelStr = this.responseText;
        var subStr = labelStr.split(",");
        for(i = 0; i < subStr.length; i++)
        {
            var labelName = subStr[i];
            var labelParent = document.createElement('div');
            labelParent.setAttribute("class", "labelParent");
            labelParent.setAttribute("id","labelParent_"+labelName);

            var label = document.createElement('div');
            label.setAttribute("class","label");
            label.setAttribute("id", labelName);
            label.textContent = labelName;

            document.getElementById("labels"+imgName).appendChild(labelParent);

           // var rmvIconClass = document.createElement('div');
           // rmvIconClass.setAttribute("class","removeIcon");
           // rmvIconClass.setAttribute("id","removeIcon"+labelName);
           var rmvIcon = document.createElement("IMG");
           rmvIcon.setAttribute("src",rmvUrl);
           rmvIcon.setAttribute("class","removeIcon");
           rmvIcon.setAttribute("id","removeIcon"+labelName);

           document.getElementById("labelParent_"+labelName).appendChild(label);
           document.getElementById("labelParent_"+labelName).appendChild(rmvIcon);
           //document.getElementById("removeIcon"+labelName).appendChild(rmvIcon);



        } 

    //creating form that will allow for the addition of new labels
    var newLabel = document.createElement('div');
    newLabel.setAttribute("class","newLabel");
    newLabel.setAttribute("id","newLabel"+imgName)
    var labelForm = document.createElement('form');

    var formInput = document.createElement('input');
    formInput.setAttribute("type", "text");
    formInput.setAttribute("name", imgName);

    var buttonInput = document.createElement('input');
    buttonInput.setAttribute("type","submit");
    buttonInput.setAttribute("value","Add");
    //buttonInput.setAttribute("onclick",addLabel);

    labelForm.appendChild(formInput);
    labelForm.appendChild(buttonInput);

    document.getElementById("labels"+imgName).appendChild(newLabel);
    document.getElementById("newLabel"+imgName).appendChild(labelForm);
    //console.log(labelForm)
}

function getLabels(imgName) {
        // construct url for query
    console.log(imgName);
    var url = "http://138.68.25.50:7398/query?type=getLabels&img="+imgName;
    console.log(url);
        // becomes method of request object oReq
    function reqListener () {
        //var pgh = document.getElementById("labels"+imgName);
        setLabels(this.responseText,imgName);




    }

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    oReq.send();
}

function dumpDataBase(){
    var oReq = new XMLHttpRequest();
    var url = "http://138.68.25.50:7398/query?op=dumpDB";

    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    
    function reqListener () {
        var dataArray = JSON.parse(this.responseText);
        addphotostoDOM(dataArray);
        console.log(dataArray);
        console.log("Success");
    }
    
    oReq.send();
}

function addphotostoDOM(array) {

for (var i = 0; i < array.length; i++) {
    var selectedFile = array[i].fileName;
    console.log(array); 
    //var div = document.createElement('div');
    var newImageDiv = document.createElement("IMG");
//    newImageDiv.setAttribute('src',selectedFile);
    

//    console.log(selectedFile);
    var imgName = selectedFile;
    var imgName = imgName.substr(0,imgName.length-4);
    //console.log(imgName);
    //console.log(selectedFile);

    var fr = new FileReader();
    fr.onload = function() {
        newImageDiv.src = fr.result;
       // console.log(newImageDiv.src);
    };

    newImageDiv.src = imgName;

   var formData = new FormData();
    // anonymous callback uses file as image source
   formData.append("userfile", selectedFile);


    var div = document.createElement('div');
    div.setAttribute("class","photo");
    div.setAttribute("id",imgName);
    div.setAttribute("onclick", "getLabels('"+imgName.substr(0,imgName.length-4)+"')");
    var textDiv = document.createElement('div');
    textDiv.setAttribute("class","labels");
    textDiv.setAttribute("id","labels"+imgName);

    var newImageDiv = document.createElement("IMG");

    var menuButton = document.createElement('div');
    menuButton.setAttribute("class","menu");
    menuButton.setAttribute("id","menu"+imgName);

    var menuName = "menu"+imgName.substr(0,imgName.length-4);
    menuButton.setAttribute("onclick","generatedropDown('"+"dropDown"+imgName+"')");

    var menuImage = document.createElement("IMG");

    menuImage.setAttribute("src",menuPath);

    var menuDropDown = document.getElementById("myDropdown");
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
    newImageDiv.setAttribute("alt", selectedFile);
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

}