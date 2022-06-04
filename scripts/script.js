const submit = document.getElementById("submit_button");
const input = document.getElementById("input_value");
const currentWeatherItems = document.getElementById("current-weather");
const error = document.getElementById("error");

const weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=";
const forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=";
const API_key = "fbfb79757d64b892e33d9ed924d3ab42";

let forecast_min_temp = [];
let forecast_max_temp = [];
let myChart = null;
let weatherData = {
  cityName: null,
  climateDescription: null,
  temperature: null,
  today_high: null,
  today_low: null,
  icon: null,
  Wind_Speed: null,
  Humidity: null,
  Pressure: null,
  Sunrise: null,
  Sunset: null,
};

window.onload = () => {
  input.value = "New York";
  getCurrentData();
};

const getCurrentData = () => {
  error.innerHTML = "";
  fetch(`${weatherURL}${input.value}&units=metric&appid=${API_key}`)
    .then((response) => response.json())
    .then((data) => {
      weatherData.cityName = data["name"];
      weatherData.climateDescription = data["weather"][0]["description"];
      weatherData.temperature = data["main"]["temp"];
      weatherData.today_high = data["main"]["temp_max"];
      weatherData.today_low = data["main"]["temp_min"];
      weatherData.icon = data["weather"][0]["icon"];
      weatherData.Wind_Speed = data["wind"]["speed"];
      weatherData.Humidity = data["main"]["humidity"];
      weatherData.Pressure = data["main"]["pressure"];
      weatherData.Sunrise = data["sys"]["sunrise"];
      weatherData.Sunset = data["sys"]["sunset"];
      getforecastData();
    })
    .catch((e) => (error.innerHTML = "Enter a valid city name"));
};

const getforecastData = () => {
  error.innerHTML = "";
  fetch(`${forecastURL}${input.value}&units=metric&cnt=7&appid=${API_key}`)
    .then((response) => response.json())
    .then((data) => {
      forecast_max_temp = [];
      forecast_min_temp = [];
      for (let i = 0; i < 7; i++) {
        forecast_max_temp.push(data["list"][i]["main"]["temp_max"]);
        forecast_min_temp.push(data["list"][i]["main"]["temp_min"]);
      }
      appendValues();
      chart();

      input.value = "";
    })
    .catch((e) => console.log((error.innerHTML = "something went wrong")));
};

const timeConversion = (unix_timestamp) => {
  date = new Date(unix_timestamp * 1000);
  let hours = date.getHours();
  let minutes = "0" + date.getMinutes();
  let seconds = "0" + date.getSeconds();
  return hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
};

const appendValues = () => {
  let sunrise = timeConversion(weatherData.Sunrise);
  let sunset = timeConversion(weatherData.Sunset);
  currentWeatherItems.classList.add("current");
  currentWeatherItems.classList.remove("none");
  currentWeatherItems.innerHTML = `
  <input type="checkbox" id="toggle" /><label for="toggle"></label>
<div class="weather-item">
   <div>city</div>
   <div>${weatherData.cityName}</div>
</div>
<div class="weather-item">
   <div>Climate</div>
   <div>${weatherData.climateDescription}
      <img src="https://openweathermap.org/img/w/${weatherData.icon}.png">
   </div>
</div>
<div class="weather-item">
   <div>Current temperature</div>
   <div>${weatherData.temperature}</div>
</div>
<div class="weather-item">
   <div>max temperature</div>
   <div>${weatherData.today_high}</div>
</div>
<div class="weather-item">
   <div>min temperature</div>
   <div>${weatherData.today_low}</div>
</div>
<span class="none" id ="more-data">
   <div class="weather-item">
      <div>wind speed</div>
      <div>${weatherData.Wind_Speed}</div>
   </div>
   <div class="weather-item">
      <div>Humidity</div>
      <div>${weatherData.Humidity}%</div>
   </div>
   <div class="weather-item">
      <div>Pressure</div>
      <div>${weatherData.Pressure}</div>
   </div>
   <div class="weather-item">
      <div>Sunrise</div>
      <div>${sunrise}</div>
   </div>
   <div class="weather-item">
      <div>Sunset</div>
      <div>${sunset}</div>
   </div>
</span>`;
  const toggle = document.getElementById("toggle");
  const more_data = document.getElementById("more-data");
  toggle.addEventListener("click", () => {
    if (more_data.style.visibility === "visible") {
      more_data.style.visibility = "hidden";
    } else {
      more_data.style.visibility = "visible";
      more_data.style.display = "flex";
      more_data.style.flexDirection = "column";
    }
  });
};

const chart = () => {
  const labels = [
    `${date.getDate()}/${date.getMonth() + 1}`,
    `${date.getDate() + 1}/${date.getMonth() + 1}`,
    `${date.getDate() + 2}/${date.getMonth() + 1}`,
    `${date.getDate() + 3}/${date.getMonth() + 1}`,
    `${date.getDate() + 4}/${date.getMonth() + 1}`,
    `${date.getDate() + 5}/${date.getMonth() + 1}`,
    `${date.getDate() + 6}/${date.getMonth() + 1}`,
  ];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "max temps this week",
        backgroundColor: "rgb(0,150, 255)",
        borderColor: "rgb(0, 150, 255)",
        data: forecast_max_temp,
      },

      {
        label: "min temps this week",
        backgroundColor: "rgb(0,50, 255)",
        borderColor: "rgb(0, 50, 255)",
        data: [...forecast_min_temp],
      },
    ],
  };
  const config = {
    type: "line",
    data: data,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return value + " °C";
            },
          },
        },
      },
    },
  };

  const chart_El = document.getElementById("myChart").getContext("2d");
  if (myChart !== null) {
    myChart.destroy();
  }
  myChart = new Chart(chart_El, config);
  const forecast = document.getElementById("forecast");
  forecast.classList.remove("none");
  forecast.classList.add("future-forecast");
};

submit.addEventListener("click", getCurrentData);
