var today = new Date();
var cityForm = document.querySelector("#city-form");
var cityNameInput = document.querySelector("#cityname");
var currentWeather = document.querySelector('#current-weather');
var currentWeatherCard = document.querySelector("#current-weather-card")
var fiveDayCard = document.querySelector("#five-day-card");
var fiveDay = document.querySelector("#five-day-body");
var weatherStatus = document.querySelector('#weather-status');
var search = document.querySelector('#search');
var historyButtons = document.querySelector("#history-buttons")
var historyCard = document.querySelector("#history")
var trash = document.querySelector("#trash")
var HistoryArray = []


var formHandler = function (event) {
    event.preventDefault();
    // get city name value from input element
    var cityname = cityNameInput.value.trim();

    // Set city name in local storage and generate history buttons
    if (cityname) {
        HistoryArray.push(cityname);
        localStorage.setItem("weatherSearch", JSON.stringify(HistoryArray));
        var History = document.createElement('button');
        History.className = "btn";
        History.setAttribute("data-city", cityname)
        History.innerHTML = cityname;
        historyButtons.appendChild(History);
        historyCard.removeAttribute("style")
        WeatherInfo(cityname);
        cityNameInput.value = "";
    }
    else {
        alert("Please enter a City name");
    }

}

// Get weather information from OpenWeather
var WeatherInfo = function (cityname) {
    var apiCityUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial&appid=f97301447cbd41068af8623a398ba1fb";
    fetch(
        // Make a fetch request using city name to get latitude and longitude for city
        apiCityUrl
    )
        .then(function (Cityresponse) {
            return Cityresponse.json();
        })
        .then(function (Cityresponse) {
            // Create variables to hold the latitude and longitude of requested city
            console.log(Cityresponse)
            var latitude = Cityresponse.coord.lat;
            var longitude = Cityresponse.coord.lon;

            // Create variables for City name, current date and icon information for use in current Weather heading
            var city = Cityresponse.name;
            var date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
            var Icon = Cityresponse.weather[0].icon;
            var Description = Cityresponse.weather[0].description;
            var IconLink = "<img src='http://openweathermap.org/img/wn/" + Icon + "@2x.png' alt='" + Description + "' title='" + Description + "'  />"

            // Empty Current Weather element for new data
            currentWeather.textContent = "";
            fiveDay.textContent = "";

            // Update <h2> element to show city, date and icon
            weatherStatus.innerHTML = city + " (" + date + ") " + IconLink;

            // Remove class name 'hidden' to show current weather card
            currentWeatherCard.classList.remove("hidden");
            fiveDayCard.classList.remove("hidden");

            // Return a fetch request to the OpenWeather using longitude and latitude from pervious fetch
            return fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=alerts,minutely,hourly&units=imperial&appid=f97301447cbd41068af8623a398ba1fb');
        })
        .then(function (response) {
            // return response in json format
            return response.json();
        })
        .then(function (response) {
            console.log(response);
            // send response data to displayWeather function for final display 
            displayPage(response);

        });
};

// Display the weather on page
var displayPage = function (weather) {
    // check if api returned any weather data
    if (weather.length === 0) {
        weatherContainer.textContent = "No weather data found.";
        return;
    }
    // Create Temperature element
    var temperatureElement = document.createElement('p');
    temperatureElement.id = "temperature";
    temperature.innerHTML = "<strong>Temperature:</strong> " + weather.current.temp.toFixed(1) + "°F";
    currentWeather.appendChild(temperature);

    // Create Humidity element
    var humidityElement = document.createElement('p');
    humidityElement.id = "humidity";
    humidity.innerHTML = "<strong>Humidity:</strong> " + weather.current.humidity + "%";
    currentWeatherEl.appendChild(humidity);

    // Create Wind Speed element
    var windElement = document.createElement('p');
    windElement.id = "wind-speed";
    windSpeed.innerHTML = "<strong>Wind Speed:</strong> " + weather.current.wind_speed.toFixed(1) + " MPH";
    currentWeather.appendChild(windSpeed);

    // Create uv-index element
    var uvIndexElement = document.createElement('p');
    var uvIndexValue = weather.current.uvi.toFixed(1);
    uvIndexElement.id = "uv-index";
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
    currentWeather.appendChild(uvIndex);

    // Get extended forecast data
    var forecastArray = weather.daily;

    // Create day cards for extended forecast
    for (let i = 0; i < forecastArray.length - 3; i++) {
        var currentdate = (today.getMonth() + 1) + '/' + (today.getDate() + i + 1) + '/' + today.getFullYear();
        var Icon = forecastArray[i].weather[0].icon;
        var Description = forecastArray[i].weather[0].description;
        var IconLink = "<img src='http://openweathermap.org/img/wn/" + Icon + "@2x.png' alt='" + Description + "' title='" + Description + "'  />"
        var day = document.createElement("div");
        day.className = "day";
        day.innerHTML = "<p><strong>" + currentdate + "</strong></p>" +
            "<p>" + IconLink + "</p>" +
            "<p><strong>Temp:</strong> " + forecastArray[i].temp.day.toFixed(1) + "°F</p>" +
            "<p><strong>Humidity:</strong> " + forecastArray[i].humidity + "%</p>"

        fiveDay.appendChild(day);

    }

}

// Load any past city weather searches
var ReloadHistory = function () {
    searchArray = JSON.parse(localStorage.getItem("weatherSearch"));

    if (searchArray) {
        searchHistoryArray = JSON.parse(localStorage.getItem("weatherSearch"));
        for (let i = 0; i < searchArray.length; i++) {
            var searchHistory = document.createElement('button');
            searchHistory.className = "btn";
            searchHistory.setAttribute("data-city", searchArray[i])
            searchHistory.innerHTML = searchArray[i];
            historyButtons.appendChild(searchHistory);
            historyCard.removeAttribute("style");
        }

    }
}

// Search weather using search history buttons
var buttonHandler= function (event) {
    var cityname = event.target.getAttribute("data-city");
    if (cityname) {
        WeatherInfo(cityname);
    }
}

// Clear Search History
var Clear = function (event) {
    localStorage.removeItem("weatherSearch");
    historyCard.setAttribute("style", "display: none");
}

cityForm.addEventListener("submit", formHandler);
historyButtons.addEventListener("click", buttonHandler);
trash.addEventListener("click", Clear);

ReloadHistory();