// uploads an image within a form object.  This currently seems
// to be the easiest way to send a big binary file.

var idNum = 0;

function uploadFile() {
    var url = "http://138.68.25.50:10273";

    // grab the file name
    var selectedFile = document.getElementById('file').files[0];


    // create a new div element 
    var newDiv = document.createElement("div"); 

    // set class name
    newDiv.className = "image";

    // create new id for image
    var imageID = "img" + idNum;
    newDiv.id = imageID;

    // create img tag/id and append in div element
    var imgTag = document.createElement("img");
    var photoID = "photo" + idNum;
    imgTag.id = photoID;
    imgTag.className = "picture";

    // check for update

    /* 
        Format for images in HTML:

        <div class="image" id="img#">
            <img class="picture" id="photo#" />
        </div>

    */


    // add the newly created element and its content into the DOM 
    var current = "img" + idNum;
    var currentDiv = document.getElementById(current); 

    document.getElementById("photos").appendChild(newDiv);
    document.getElementById(imageID).appendChild(imgTag);


    // grab newly created img tag
    var image = document.getElementById(photoID);

    


      
    
    // Anonymous callback uses file as image source
    // A handler for the load event. 
    // This event is triggered each time the
    // reading operation is successfully completed.
    var fr = new FileReader();
    fr.onload = function () {
        image.src = fr.result;
        //jason change
        fadeImage(photoID);
    };
    fr.readAsDataURL(selectedFile); // begin reading


    //console.log(selectedFile.name);
    var formData = new FormData();
    
    // stick the file into the form
    formData.append("userfile", selectedFile);

    var oReq = new XMLHttpRequest();
    // POST requests contain data in the body
    // the "true" is the default for the third param, so
    // it is often omitted; it means do the upload
    // asynchornously, that is, using a callback instead
    // of blocking until the operation is completed.
    oReq.open("POST", url, true);
    
    oReq.onload = function() {
        // the response, in case we want to look at it
        var singleImage = document.getElementById(photoID);
        //jason change
        singleImage.src = oReq.responseText;
        unFadeImage(photoID);
        console.log(oReq.responseText);

    }
    oReq.send(formData);
    // increment id number for next insertion
    idNum++; 
}

function fadeImage(photoID) {
   
    var image = document.getElementById(photoID);
    image.style.opacity = 0.5;
}

function unFadeImage(photoID) {
    var image = document.getElementById(photoID);
    image.style.opacity = 1.0;
}
