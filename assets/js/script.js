var currentDate = new Date();
var cityForm = document.querySelector("#city-form");
var cityNameInput = document.querySelector("#cityname");
var currentWeather = document.querySelector('#current-weather');
var currentWeatherCard = document.querySelector("#current-weather-card")
var fiveDayCard = document.querySelector("#five-day-card");
var fiveDay = document.querySelector("#five-day-body");
var weatherStatus = document.querySelector('#weather-status');
var searchBtn = document.querySelector('#search');
var historyButtons = document.querySelector("#history-buttons")
var historyCard = document.querySelector("#history")
var trashBtn = document.querySelector("#trash")
var searchHistory = []


var handleFormSubmit = function (event) {
    event.preventDefault();
    var cityName = cityNameInput.value.trim();

    if (cityName) {
        searchHistory.push(cityName);
        localStorage.setItem("weatherSearch", JSON.stringify(searchHistory));
        var historyBtn = document.createElement('button');
        historyBtn.className = "btn";
        historyBtn.setAttribute("data-city", cityName)
        historyBtn.innerHTML = cityName;
        historyButtons.appendChild(historyBtn);
        historyCard.removeAttribute("style")
        fetchWeatherInfo(cityName);
        cityNameInput.value = "";
    }
    else {
        alert("Please enter a City name");
    }

}

var fetchWeatherInfo = function (cityName) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=f97301447cbd41068af8623a398ba1fb";
    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            console.log(response)
            var latitude = response.coord.lat;
            var longitude = response.coord.lon;

            var city = response.name;
            var date = (currentDate.getMonth() + 1) + '/' + currentDate.getDate() + '/' + currentDate.getFullYear();
            var weatherIcon = response.weather[0].icon;
            var weatherDescription = response.weather[0].description;
            var weatherIconLink = "<img src='http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png' alt='" + weatherDescription + "' title='" + weatherDescription + "'  />"

            currentWeather.textContent = "";
            fiveDay.textContent = "";

            weatherStatus.innerHTML = city + " (" + date + ") " + weatherIconLink;

            currentWeatherCard.classList.remove("hidden");
            fiveDayCard.classList.remove("hidden");

            return fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=alerts,minutely,hourly&units=imperial&appid=f97301447cbd41068af8623a398ba1fb');
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            displayWeather(response);
        });
};

var displayWeather = function (weather) {
    if (weather.length === 0) {
        weatherContainerEl.textContent = "No weather data found.";
        return;
    }
    
    var temperature = document.createElement('p');
    temperature.id = "temperature";
    temperature.innerHTML = "<strong>Temperature:</strong> " + weather.current.temp.toFixed(1) + "°F";
    currentWeather.appendChild(temperature);

    var humidity = document.createElement('p');
    humidity.id = "humidity";
    humidity.innerHTML = "<strong>Humidity:</strong> " + weather.current.humidity + "%";
    currentWeather.appendChild(humidity);

     // Create Wind Speed element
     var windSpeed = document.createElement('p');
     windSpeed.id = "wind-speed";
     windSpeed.innerHTML = "<strong>Wind Speed:</strong> " + weather.current.wind_speed.toFixed(1) + " MPH";
     currentWeatherEl.appendChild(windSpeed);
 
     // Create uv-index element
     var uvIndex = document.createElement('p');
     var uvIndexValue = weather.current.uvi.toFixed(1);
     uvIndex.id = "uv-index";
     if (uvIndexValue >= 0) {
         uvIndex.className = "uv-index-green"
     }
     if (uvIndexValue >= 3) {
         uvIndex.className = "uv-index-yellow"
     }
     if (uvIndexValue >= 8) {
         uvIndex.className = "uv-index-red"
     }
     uvIndex.innerHTML = "<strong>UV Index:</strong> <span>" + uvIndexValue + "</span>";
     currentWeatherEl.appendChild(uvIndex);
 
     // Get extended forecast data
     var forecastArray = weather.daily;
 
     // Create day cards for extended forecast
     for (let i = 0; i < forecastArray.length - 3; i++) {
         var date = (today.getMonth() + 1) + '/' + (today.getDate() + i + 1) + '/' + today.getFullYear();
         var weatherIcon = forecastArray[i].weather[0].icon;
         var weatherDescription = forecastArray[i].weather[0].description;
         var weatherIconLink = "<img src='http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png' alt='" + weatherDescription + "' title='" + weatherDescription + "'  />"
         var dayEl = document.createElement("div");
         dayEl.className = "day";
         dayEl.innerHTML = "<p><strong>" + date + "</strong></p>" +
             "<p>" + weatherIconLink + "</p>" +
             "<p><strong>Temp:</strong> " + forecastArray[i].temp.day.toFixed(1) + "°F</p>" +
             "<p><strong>Humidity:</strong> " + forecastArray[i].humidity + "%</p>"
 
         fiveDayEl.appendChild(dayEl);
 
     }
 
 }
 
 // Load any past city weather searches
 var loadHistory = function () {
     searchArray = JSON.parse(localStorage.getItem("weatherSearch"));
 
     if (searchArray) {
         searchHistoryArray = JSON.parse(localStorage.getItem("weatherSearch"));
         for (let i = 0; i < searchArray.length; i++) {
             var searchHistoryEl = document.createElement('button');
             searchHistoryEl.className = "btn";
             searchHistoryEl.setAttribute("data-city", searchArray[i])
             searchHistoryEl.innerHTML = searchArray[i];
             historyButtonsEl.appendChild(searchHistoryEl);
             historyCardEl.removeAttribute("style");
         }
 
     }
 }
 
 // Search weather using search history buttons
 var buttonClickHandler = function (event) {
     var cityname = event.target.getAttribute("data-city");
     if (cityname) {
         getWeatherInfo(cityname);
     }
 }
 
 // Clear Search History
 var clearHistory = function (event) {
     localStorage.removeItem("weatherSearch");
     historyCardEl.setAttribute("style", "display: none");
 }
 
 cityFormEl.addEventListener("submit", formSubmitHandler);
 historyButtonsEl.addEventListener("click", buttonClickHandler);
 trashEl.addEventListener("click", clearHistory);
 
 loadHistory();

  