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

   // Create wind speed paragraph element
var windSpeedEl = document.createElement('p');
windSpeedEl.id = "wind-speed";

// Set wind speed text
var windSpeedText = "Wind Speed: " + weather.current.wind_speed.toFixed(1) + " MPH";
windSpeedEl.textContent = windSpeedText;

// Append wind speed element to current weather element
currentWeatherEl.appendChild(windSpeedEl);

// Get extended forecast data
const forecastArray = weather.daily;

// Create day cards for extended forecast
for (let i = 0; i < forecastArray.length - 3; i++) {
  const date = `${today.getMonth() + 1}/${today.getDate() + i + 1}/${today.getFullYear()}`;
  const weatherIcon = forecastArray[i].weather[0].icon;
  const weatherDescription = forecastArray[i].weather[0].description;
  const weatherIconLink = `<img src="http://openweathermap.org/img/wn/${weatherIcon}@2x.png"
                            alt="${weatherDescription}" title="${weatherDescription}" />`;
  const dayEl = document.createElement("div");
  dayEl.className = "day";
  dayEl.innerHTML = `<p><strong>${date}</strong></p>
                     <p>${weatherIconLink}</p>
                     <p><strong>Temp:</strong> ${forecastArray[i].temp.day.toFixed(1)}°F</p>
                     <p><strong>Humidity:</strong> ${forecastArray[i].humidity}%</p>`;
  
  fiveDayEl.appendChild(dayEl);
    }   

}

if (searchArray) {
    searchHistoryArray = JSON.parse(localStorage.getItem("weatherSearch"));
    for (let i = 0; i < searchArray.length; i++) {
        var searchHistoryEl = document.createElement('button');
        searchHistoryEl.className = "btn";
        searchHistoryEl.setAttribute("data-city", searchArray[i])
        searchHistoryEl.textContent = searchArray[i];
        historyButtonsEl.appendChild(searchHistoryEl);
        historyCardEl.removeAttribute("style");
    }

}
// Function to handle search history button clicks
function handleButtonClick(event) {
    const city = event.target.dataset.city;
    if (city) {
      getWeather(city);
    }
  }
  
  // Function to clear search history
  function clearHistory(event) {
    localStorage.removeItem("weatherSearch");
    historyCardEl.style.display = "none";
  }
  
  // Add event listeners
  cityFormEl.addEventListener("submit", formSubmitHandler);
  historyButtonsEl.addEventListener("click", handleButtonClick);
  trashEl.addEventListener("click", clearHistory);
  
  // Load search history
  function loadHistory() {
    const searchArray = JSON.parse(localStorage.getItem("weatherSearch"));
    if (searchArray) {
      const historyButtons = searchArray.map(city => {
        const button = document.createElement("button");
        button.className = "btn";
        button.dataset.city = city;
        button.textContent = city;
        return button;
      });
      historyButtonsEl.append(...historyButtons);
      historyCardEl.style.display = "";
    }
  }
  
  loadHistory();
  