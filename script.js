//BBC News API Key
//282484ee72cd423b8c99a1e49072218f
var backgrounds;
var count = 0;


function displayNews(data){
  var img = document.getElementById("news_image");
  var title = document.getElementById("news_title");
  var author = document.getElementById("news_author");
  var description = document.getElementById("news_desc");
  var hList = document.getElementById("headlines");
  var headlines = hList.getElementsByTagName("li");




  description.innerHTML = data.articles[count].description;
  author.innerHTML = data.articles[count].author;
  title.innerHTML = data.articles[count].title;
  img.src = data.articles[count].urlToImage;


  for(var i = 0;i < data.articles.length-1; i++){
    headlines[i].innerHTML = data.articles[i].title;
    headlines[i].style.color = "#ffffff";
  }

  //Change the color of the headline that is on the bigger section
  console.log(count);
  headlines[count].style.color = "#8a8a8a";

  if(count < 8)
    count = count + 1;
  else
    count = 0;
}



function handleNews(){
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function(){
    if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
      displayNews(JSON.parse(xmlHttp.responseText));
    }
  }
  xmlHttp.open("GET","https://newsapi.org/v1/articles?source=reuters&sortBy=top&apiKey=282484ee72cd423b8c99a1e49072218f ",true);
  xmlHttp.send(null);
}




function displayWeather(weather){
  //Convert to fahrenheit
  var icon = document.getElementById("weather_icon");
  weather.temperature = Math.round((weather.temperature*1.8) - 459.4);
  document.getElementById("weather_desc").innerHTML = "Currently " + weather.temperature + " with " + weather.description + " in " + weather.location;

  if(weather.description == "clear sky"){
    if(new Date().getHours() <= 18){
      icon.src = "resources/icons/clear day.png";
    }else{
      icon.src = "resources/icons/clear night.png";
    }
  }else if(weather.description == "few clouds"){
    icon.alt = "Cloudy";
    if(new Date().getHours() <= 18){
      icon.src = "resources/icons/clouds day.png";
    }else{
      icon.src = "resources/icons/clouds night.png";
    }
  }else if(weather.description == "scattered clouds"){
    icon.alt = "Scattered Clouds";
    if(new Date().getHours() <= 18){
      icon.src = "resources/icons/clouds day.png";
    }else{
      icon.src = "resources/icons/clouds night.png";
    }
  }else if(weather.description == "broken clouds" || weather.description == "overcast clouds"){
    icon.alt = "Broken Clouds";
    icon.src = "resources/icons/broken clouds.png"
  }else if(weather.description == "light rain"){
    icon.alt = "Light Rain";
    if(new Date().getHours() <= 18){
      icon.src = "resources/icons/rain day.png";
    }else{
      icon.src = "resources/icons/rain night.png";
    }
  }


}

function handleWeather(){
  var APPID = "63ea39292d2682b4b8db86a20e1a69dd";
  var url = "http://api.openweathermap.org/data/2.5/weather?" +
    "zip=" + 22192 +
    ",us&APPID=" + APPID;



  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function(){

    if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
      var data = JSON.parse(xmlhttp.responseText);
      //console.log(data);
      var weather = {};
      weather.temperature = data.main.temp
      weather.description = data.weather[0].description;
      weather.location = data.name;
      displayWeather(weather);
    }
  };
  xmlhttp.open("GET",url,true);
  xmlhttp.send();
}

function transition(){
  var bg = document.getElementById("transition");
  bg.style.opacity -= .05;

  if(bg.style.opacity > 0)
    setTimeout("transition()",100);

}


/*
  There is a "Transition Background" on top of the actual background
  When a transition begins the transitionBG source gets set to the actual background's source
  Then the actual background is changed, but the change is not visible while behind the transitionBG
  Then the transitionBG fades away revealing the new background
*/
function beginTransition(){
  var tBackground = document.getElementById("transition");
  var background = document.getElementById("background");
  tBackground.src = background.src;
  background.src = "resources/backgrounds/" + backgrounds[Math.floor(Math.random()*backgrounds.length)];
  //To make sure we don't get the same image twice in a row
  while(background.src == tBackground.src){
    background.src = "resources/backgrounds/" + backgrounds[Math.floor(Math.random()*backgrounds.length)];
  }
  tBackground.style.opacity = 1;
  setTimeout("transition()",1000);
}


//Daily quote: API Call limit of 10 per hour
function handleQuote(){
  var url = "http://quotes.rest/qod.json?category=inspire"
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function(){
    if(xmlhttp.readyState == 4 || xmlhttp.status == 200){
      var data = JSON.parse(xmlhttp.responseText);
      //console.log(data.contents.quotes[0].quote);
    }
  };


  xmlhttp.open("GET",url,true);
  xmlhttp.send();
}

function handleWiki(){
  var temp = document.createElement("script");
  temp.type = "text/javascript";
  temp.id= "tempscript";
  //temp.src = "http://en.wikipedia.org/w/api.php?action=query&format=json&callback=complete&prop=langlinks&lllimit=500&titles=kaas"
  temp.src = "https://en.wikipedia.org/w/api.php?action=query&titles=Main%20Page&prop=revisions&rvprop=content&format=json&callback=complete"

  document.body.appendChild(temp);

}

function complete(data){
  console.log(data.query.pages["15580374"].revisions[0]["*"]);
  //console.log(data.query.pages);
}

//&deg;
window.onload = function(){
  //Choose random background to start off with
  backgrounds = ["home_rock.jpg","petzen_austria.jpg","Emek Can Ozben.jpg","yosemite.jpg","Brayan Buitrago.jpg","gekatarina.jpg","ruslan-davydkin.jpg","starkiteckt-designs.jpg","sea.jpg","water.jpg"];
  var background = document.getElementById("background");
  background.src = "resources/backgrounds/" + backgrounds[Math.floor(Math.random()*backgrounds.length)];
  refresh();
  //handleQuote();
  dateInfo();
}



//Refresh stuff every five minutes
function refresh(){
  beginTransition();
  handleWeather();
  handleNews();
  setTimeout("refresh()",300000);
}



function dateInfo(){
  var months = ["Jan","Fed","March","April","May","Jun","July","Aug","Sep","Oct","Nov","Dec"];
  var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var dateDisplay = document.getElementById("date");
  var timeDisplay = document.getElementById("time");
  var date = new Date,
      hour = date.getHours(),
      minute = date.getMinutes(),
      second = date.getSeconds();
      day = date.getDay();
      month = date.getMonth();
      year = date.getFullYear();
      numberDate = date.getDate();

  if(date.getHours() < 10)
    hour = "0" + date.getHours();
  else
    hour = date.getHours();


  if(date.getMinutes() < 10)
    minute = "0" + date.getMinutes();
  else
    minute = date.getMinutes();


  if(date.getSeconds() < 10)
    second = "0" + date.getSeconds();
  else
    second = date.getSeconds();


  timeDisplay.innerHTML = hour + ":" + minute + ":" + second;

  dateDisplay.innerHTML = days[day] + ", " + months[month] + " " + numberDate;
  setTimeout("dateInfo()",1000);
}
