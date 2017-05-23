
function readFile() {
    var selectedFile = document.getElementById('fileSelector').files[0];
    var image = document.getElementById('theImage');

    var fr = new FileReader();
    // anonymous callback uses file as image source
    fr.onload = function () {
	image.src = fr.result;
    };
    fr.readAsDataURL(selectedFile);    // begin reading
}

function fadeImage() {
    var image = document.getElementById('theImage');
    var button = document.getElementById('fadeButton');
    if (button.textContent == 'Fade') {
	image.style.opacity = 0.5;
	button.textContent = 'UnFade';
    } else {
	image.style.opacity = 1.0;
	button.textContent = 'Fade';
    }
}
