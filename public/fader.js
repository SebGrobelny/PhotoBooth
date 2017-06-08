
var idNum = 0;

function renderPhotoElements(newImageDiv, imgName )
{
    var url = "http://138.68.25.50:7398";  

    //create photo class
    var photo = document.createElement('div');
    photo.setAttribute("class","photo");
    photo.setAttribute("id",imgName);
    //if 0 it is not a favorite, if 1 it is a favorite
    photo.setAttribute("value", 0);

    //div.setAttribute("onclick", "getLabels('"+imgName.substr(0,imgName.length-4)+"')");

    //create the main label container
    var textDiv = document.createElement('div');
    textDiv.setAttribute("class","labels");
    textDiv.setAttribute("id","labels"+imgName);

    

    var menuButton = document.createElement('div');
    menuButton.setAttribute("class","menu");
    menuButton.setAttribute("id","menu"+imgName);

    var menuName = "menu"+imgName;
    menuButton.setAttribute("onclick","generatedropDown('dropDown"+imgName+"')");

    var menuPath = url+"/optionsTriangle.png";
    var menuImage = document.createElement("IMG");

    menuImage.setAttribute("src",menuPath);
    
    //create overlay
    var overlay = document.createElement('div');
    overlay.setAttribute("class","overlay"); 
    overlay.setAttribute("id","overlay"+imgName);



    newImageDiv.src = imgName;
    // newImageDiv.setAttribute("src", newImageDiv.src);
    // console.log(newImageDiv.src);
    newImageDiv.setAttribute("alt", imgName);
    newImageDiv.setAttribute("width", "250");
    newImageDiv.setAttribute("height", "300");

    document.getElementById("photoBody").appendChild(photo);

    photo.appendChild(overlay);


    document.getElementById("overlay"+imgName).appendChild(newImageDiv);
    document.getElementById("overlay"+imgName).appendChild(menuButton); 

    createMenu(imgName);
    //append label text to photo div
    document.getElementById(imgName).appendChild(textDiv);

    getLabels(imgName);
    
    //append menu image to menu div 
    document.getElementById("menu"+imgName).appendChild(menuImage);


}

function readFile() {
    var url = "http://138.68.25.50:7398";    
    var selectedFile = document.getElementById('fileSelector').files[0];
    var imgName = selectedFile['name'];
    var newImageDiv = document.createElement("IMG");

    var fr = new FileReader();
    fr.onload = function() {
    newImageDiv.src = fr.result;
    //console.log(newImageDiv.src);
    }; 
    
    fr.readAsDataURL(selectedFile);

    var formData = new FormData();
    // anonymous callback uses file as image source
    formData.append("userfile", selectedFile);

    var oReq = new XMLHttpRequest();
    
     oReq.open("POST", url, true);
    oReq.onload = function() {
    console.log(oReq.responseText);
    setLabels(oReq.responseText, imgName);
    }

    oReq.send(formData);

    renderPhotoElements(imgName,selectedFile);


}

function createMenu(imgName)
{
    var menuDropDown = document.createElement('div');
    menuDropDown.setAttribute("id", "dropDown"+imgName);
    menuDropDown.setAttribute("class", "dropdown-content");

    var change = document.createElement('div');
    change.setAttribute("class","change");
    change.setAttribute("id","change"+imgName);
    change.setAttribute("onclick","generateTags('"+imgName+"')");
    change.textContent = "Change Tags";

    var add = document.createElement('div');
    add.setAttribute("class","add");
    add.setAttribute("id","add"+imgName);
    add.setAttribute("onclick","addFavorite('"+imgName+"')");
    add.textContent = "Add to Favorites";
    document.getElementById("menu"+imgName).appendChild(menuDropDown);
    menuDropDown.appendChild(change);
    menuDropDown.appendChild(add);


}


function changeUnFavorite(imgName)
{
    var add = document.getElementById("add"+imgName);
    add.setAttribute("onclick","unFavorite('"+imgName+"')");
    add.textContent = "Unfavorite";
}

function changeAddFavorite(imgName)
{
    var add = document.getElementById("add"+imgName);
    add.setAttribute("onclick","addFavorite('"+imgName+"')");
    add.textContent = "Add to Favorites";
}


function addFavorite(imgName){

    var url = "http://138.68.25.50:7398/query?op=postFavorite&img="+imgName;
    console.log(url);

    changeUnFavorite(imgName);


    function reqListener () {
        //var pgh = document.getElementById("labels"+imgName);
        // setLabels(this.responseText,imgName);
        // generateTags(imgName);
    }

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    oReq.send();

}


function unFavorite(imgName){

    var url = "http://138.68.25.50:7398/query?op=unFavorite&img="+imgName;
    console.log(url);
    changeAddFavorite(imgName);

    function reqListener () {
        //var pgh = document.getElementById("labels"+imgName);
        // setLabels(this.responseText,imgName);
        // generateTags(imgName);
    }

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    oReq.send();


}

function displayFavorite()
{
    console.log("in displayFavorite");
    $('div[value=0]').hide();
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
            //labelParent.setAttribute("id","labelParent_"+labelName);

            var label = document.createElement('div');
            label.setAttribute("class","label");
            label.setAttribute("id", labelName);
            label.textContent = labelName;

            document.getElementById("labels"+imgName).appendChild(labelParent);

           var rmvIcon = document.createElement("IMG");
           rmvIcon.setAttribute("src",rmvUrl);
           rmvIcon.setAttribute("class","removeIcon");
           rmvIcon.setAttribute("id","removeIcon"+labelName);
           rmvIcon.setAttribute("onclick","removeLabels('"+imgName+","+labelName+"')");

           labelParent.appendChild(label);
           labelParent.appendChild(rmvIcon);
           //document.getElementById("removeIcon"+labelName).appendChild(rmvIcon);

        } 

    //creating form that will allow for the addition of new labels
    var newLabel = document.createElement('div');
    newLabel.setAttribute("class","newLabel");
    newLabel.setAttribute("id","newLabel"+imgName)
    var labelForm = document.createElement('form');
    //labelForm.setAttribute("onSubmit","addLabels('"+imgName+"')");

    var formInput = document.createElement('input');
    formInput.setAttribute("type", "text");
    formInput.setAttribute("name", "text"+imgName);
    formInput.setAttribute("id","text"+imgName);

    var buttonInput = document.createElement('input');
    buttonInput.setAttribute("type","button");
    buttonInput.setAttribute("value","Add");
    buttonInput.setAttribute("onclick","addLabels('"+imgName+"')");
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
    var url = "http://138.68.25.50:7398/query?op=getLabels&img="+imgName;
    console.log(url);
        // becomes method of request object oReq
    function reqListener () {
        //var pgh = document.getElementById("labels"+imgName);
        setLabels(this.responseText,imgName);
        generateTags(imgName);
    }

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    oReq.send();
}

function clearLabels(imgName){
    console.log("clearLabels");
    var myNode = document.getElementById("labels"+imgName);
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }

}

function addLabels(imgName) 
{
    // query looks like: op=add&img=[image filename]&label=[label to add]
    console.log("adding labels");
    console.log(imgName);
    var label = document.getElementById("text"+imgName).value;
    var url = "http://138.68.25.50:7398/query?op=addLabels&img="+imgName+"&label="+label;

    console.log(url);

    function reqListener () {
        clearLabels(imgName);
        //var pgh = document.getElementById("labels"+imgName);
        setLabels(this.responseText,imgName);
        //var currentLabels = this.responseText;
        //var finalLabels = currentLabels+", "+label;

    }

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    oReq.send();
}

function removeLabels(param)
{
    console.log("removing labels");
    console.log(param);

    var substr = param.split(", ");
    var find = " ";
    var re = new RegExp(find, 'g');


    var label = substr[1].replace(re, "%20");
    var imgName = substr[0];
    //var label = document.getElementById("text"+imgName).value;
    var url = "http://138.68.25.50:7398/query?op=rmvLabels&img="+imgName+"&label="+label;

    console.log(url);

    function reqListener () {
        clearLabels(imgName);
        //var pgh = document.getElementById("labels"+imgName);
        setLabels(this.responseText,imgName);
        //var currentLabels = this.responseText;
        //var finalLabels = currentLabels+", "+label
    }

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    oReq.send();

}

function searchFilter()
{
 
    var label = document.getElementById("searchbar").value;
    var url = "http://138.68.25.50:7398/query?op=filter&label="+label;

    console.log(url);

    function reqListener () {
        var myNode = document.getElementById("photoBody");

        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
            }
            console.log("Found Filter: " +this.responseText);
        var dataArray = JSON.parse(this.responseText);
        addphotostoDOM(dataArray);
        console.log(dataArray);
        console.log("Success");

    }

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    oReq.send();
}

function clearFilter()
{
    var oReq = new XMLHttpRequest();
    var url = "http://138.68.25.50:7398/query?op=dumpDB";
    
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);

    function reqListener () {
        var myNode = document.getElementById("photoBody");

        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
            }

        var dataArray = JSON.parse(this.responseText);
        addphotostoDOM(dataArray);
        console.log(dataArray);
        console.log("Success");
    }

    oReq.send();


}

function displayFavorites(){
    var oReq = new XMLHttpRequest();
    var url = "http://138.68.25.50:7398/query?op=dumpFavorite";
    
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);

    function reqListener () {
        var myNode = document.getElementById("photoBody");

    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
        }

        var dataArray = JSON.parse(this.responseText);
        addphotostoDOM(dataArray);

        //add UnFavorite function to all of the favorited ones
        for (var i = 0; i < dataArray.length; i++)
        {
            var imgName = dataArray[i].fileName;
            changeUnFavorite(imgName);
        }
        console.log(dataArray);
        console.log("Success");
    }

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

  console.log("Print array");
    
    var url = "http://138.68.25.50:7398";  
  for (var i = 0; i < array.length; i++) {
    var selectedFile = array[i].fileName;
    var imgName = selectedFile;

    var newImageDiv = document.createElement("IMG");
    
    var fr = new FileReader();
    fr.onload = function() {
    newImageDiv.src = fr.result;
    //console.log(newImageDiv.src);
    }; 

    var oReq = new XMLHttpRequest();
    
     oReq.open("POST", url, true);
    oReq.onload = function() {
    console.log(oReq.responseText);
    setLabels(oReq.responseText, imgName);
    }


    
     renderPhotoElements(newImageDiv,imgName,);



  }
}