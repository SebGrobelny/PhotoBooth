
/* function called at initiation */

left = 0;
curIndex =0;
flexbox = 0;
function init() { 


	var data = getDavis();


	var range = document.getElementById("range"); 
	var rangeWidth = range.clientWidth; 
	var steppers = document.getElementsByClassName("stepper");
	var n = steppers.length; 
	for (i = 0; i < n; i++) { 
		left = left+5;
		steppers[i].style.left= left+"px";
		console.log(steppers[i].style.left);
		
			}

	left = -5;

	console.log(left);

	var button = document.getElementById("left");
		button.style.visibility = 'hidden';

	getDavis();

} 

/* called on initialization */
function getDavis(){
	var script = document.createElement('script');

	script.src = "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='davis, ca')&format=json&callback=callbackFunction";
	script.id = "jsonpCall"

		// remove old script
	var oldScript = document.getElementById("jsonpCall");
	if (oldScript != null) {
		document.body.removeChild(oldScript);
	}

	// put new script into DOM at bottom of body
	document.body.appendChild(script);
}


/* called when button is pushed */

function gotNewPlace() {
	// get what the user put into the textbox
	var newPlace = document.getElementById("zipbox").value;

	// make a new script element
	var script = document.createElement('script');

	// start making the complicated URL
	script.src = "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='"+newPlace+"')&format=json&callback=callbackFunction";
	script.id = "jsonpCall";

	// remove old script
	var oldScript = document.getElementById("jsonpCall");
	if (oldScript != null) {
		document.body.removeChild(oldScript);
	}

	// put new script into DOM at bottom of body
	document.body.appendChild(script);
}



/* called when right arrow is pressed */
function goRight(){

	var range = document.getElementById("range"); 
	var rangeWidth = range.clientWidth; 
	var steppers = document.getElementsByClassName("stepper"); 
	var n = steppers.length; 
	n = n-1;
	left =left-205;
		for (i = n; i >= 0; i--) { 
		console.log(i);
			left = left-5;
		steppers[i].style.left= left+"px";
		console.log(steppers[i].style.left);
		

			}
	left =left-5;

		

	flexbox =  flexbox+1;
	console.log("flexbox:");
	console.log(flexbox);

	if(flexbox > 0 )
	{
		var button = document.getElementById("left");
		button.style.visibility = 'visible';
	}

	/*pushed five times */

	if (flexbox == 5)
	{
		var button = document.getElementById("right");
		button.style.visibility = 'hidden';

	}


}

/* called when left arrow is pressed */
function goLeft(){
	var range = document.getElementById("range"); 
	var rangeWidth = range.clientWidth; 
	var steppers = document.getElementsByClassName("stepper"); 
	var n = steppers.length; 

	left =left+205;

	for (i = 0; i < n; i++) { 
		console.log(i);

					left = left+5;
		steppers[i].style.left= left+"px";

		console.log(steppers[i].style.left);
			}

	flexbox = flexbox-1;

	if(flexbox < 5 )
	{
		var button = document.getElementById("right");
		button.style.visibility = 'visible';
	}

	if (flexbox == 0)
	{
		var button = document.getElementById("left");
		button.style.visibility = 'hidden';

	}

}

function getProperImage(code)
{
	code = code.trim();
	
	if(code === "28" || code === "26")
	{
		var cloudyPath = "./WeatherApp/cloudy.png";
		return cloudyPath;
	}
	if(code === "16")
	{
		var snowPath = "./WeatherApp/snow.png";
		return snowPath;

	}
	if(code === "4")
	{
		var thunderPath = "./WeatherApp/thunder.png";
		return thunderPath;

	}
	if(code == "32" || code == "34")
	{

		var sunnyPath = "./WeatherApp/sunny.png";
		return sunnyPath;

	}
	if(code === "24")
	{
		var windyPath = "./WeatherApp/wind.png";
		return windyPath;

	}
	if(code == "30")
	{

		var cloudyPath = "./WeatherApp/part-sun.png";
		return cloudyPath;
	}
	if(code == "12")
	{
		var rainPath = "./WeatherApp/rain.png";
		return rainPath;

	}
	else 
	{
		// console.log("could not find a valid match");
	}
}

function populateMobile(data){

	var date = document.getElementsByClassName("mobileDate");
    var high = document.getElementsByClassName("mobileHigh");
    var low = document.getElementsByClassName("mobileLow");
    var text = document.getElementsByClassName("mobileText");
    var getImage = document.getElementById("mobileImg");


    var query = data.query.results.channel.item.forecast[0];

	date[0].textContent = query.day;
	high[0].textContent =query.high+ '\u00B0';
	low[0].textContent = query.low+ '\u00B0';
	text[0].textContent = query.text;

    var source = getProperImage(query.code);

	getImage.src = source;




}

function populateParent(data){


    var mainTime = document.getElementsByClassName("mainTime");
	var mainMonth = document.getElementsByClassName("mainMonth");
	var mainTown = document.getElementsByClassName("mainTown");
	var mainTemp = document.getElementsByClassName("mainTemp");
	var mainText = document.getElementsByClassName("mainText");
	var mainImg = document.getElementById("img");



	var date = data.query.results.channel.item.condition.date;

	var dateList = date.split(" ");


	mainTime[0].textContent = "Today"+" "+dateList[4]+" "+dateList[5];
	mainMonth[0].textContent = dateList[2]+" "+dateList[1]+","+dateList[3];
	mainTown[0].textContent = data.query.results.channel.location.city;
	mainTemp[0].textContent = data.query.results.channel.item.condition.temp+'\u00B0';
	mainText[0].textContent = data.query.results.channel.item.condition.text;

	mainImg.src = getProperImage(data.query.results.channel.item.condition.code);




}


function populateChildren(data){


    var date = document.getElementsByClassName("date");
    var high = document.getElementsByClassName("high");
    var low = document.getElementsByClassName("low");
    var text = document.getElementsByClassName("text");
  
    console.log(date);
    var n = date.length; 
    console.log(n);
    var j = 1;
	for (i = 0; i < n; i++) { 

		var query = data.query.results.channel.item.forecast[i];

		date[i].textContent = query.day;
		high[i].textContent =query.high+ '\u00B0';
		low[i].textContent = query.low+ '\u00B0';
		text[i].textContent = query.text;

		var getImage = document.getElementById("img"+ i);

		var source = getProperImage(query.code);

		getImage.src = source;

		
		
	}

}

/* called when new weather arrives */

function callbackFunction(data) {
	// data contains object returned from server

	// dump it to the Web page
	populateMobile(data);
	populateParent(data);
	populateChildren(data);




}


