const searchBox = document.querySelector(".searchBox");
const searchButton = document.querySelector(".searchButton");
const key = "1dac517eda15b4a4d87d9458804c21b5";
const url = "http://api.openweathermap.org/data/2.5/weather?";
const lang = "lang=it";
const unit = "units=metric";
let desc = document.querySelector(".desc");
let temp = document.querySelector(".temp");
let city = document.querySelector(".city");
let nation = document.querySelector(".nation");
let temperatureSection = document.querySelector(".temperatureSection");
let temperatureSpan = document.querySelector(".temperatureSection span");
let icon = document.querySelector(".icon");
let notification = document.querySelector(".notification");

searchButton.addEventListener("click", search);

//FETCH function is a PROMISE
let weatherAppAll = function weatherApp() {
  clearAlert();
  const fetchApi = fetch(
    `${url}q=${searchBox.value}&${unit}&${lang}&appid=${key}`
  )
    .then((result) => result.json())
    .then((data) => {
      //Set DOM elements
      console.log(data);
      city.textContent = data.name;
      let infoWeather = data.weather[0].description;
      desc.textContent = capitalized(infoWeather);
      temp.textContent = Math.floor(data.main.temp);
      iconId = data.weather[0].icon;
      //Change the weather icon
      icon.innerHTML = `<img class="icon-dim" src="icons/${iconId}.svg"/>`;
      //Formula for fahrenheit
      let fahrenheit = data.main.temp * 1.8 + 32;
      //Change temperature from °C to °F
      temperatureSection.addEventListener("click", () => {
        if (temperatureSpan.textContent === "°C") {
          temperatureSpan.textContent = "°F";
          temp.textContent = Math.floor(fahrenheit);
        } else {
          temperatureSpan.textContent = "°C";
          temp.textContent = Math.floor(data.main.temp);
        }
      });
    })
    .catch((error) => {
      displayError();
      clearWeatherDisplay();

      console.log(new Error("Inserisci il nome di una città valida"));
    });
};

searchButton.addEventListener("click", weatherAppAll);
searchButton.addEventListener("enter", weatherAppAll);

//Geolocate weather of the current position
window.addEventListener("load", () => {
  clearAlert();
  let lat;
  let long;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      long = position.coords.longitude;
      lat = position.coords.latitude;
      const GeoApi = `${url}lat=${lat}&lon=${long}&${unit}&${lang}&appid=${key}`;
      fetch(GeoApi)
        .then((result) => result.json())
        .then((data) => {
          city.textContent = data.name;
          let infoWeather = data.weather[0].description;
          desc.textContent = capitalized(infoWeather);
          temp.textContent = Math.floor(data.main.temp);
          iconId = data.weather[0].icon;
          //Change the weather icon
          icon.innerHTML = `<img class="icon-dim" src="icons/${iconId}.svg"/>`;
          //Formula for fahrenheit
          let fahrenheit = data.main.temp * 1.8 + 32;
          //Change temperature from °C to °F
          temperatureSection.addEventListener("click", () => {
            if (temperatureSpan.textContent === "°C") {
              temperatureSpan.textContent = "°F";
              temp.textContent = Math.floor(fahrenheit);
            } else {
              temperatureSpan.textContent = "°C";
              temp.textContent = Math.floor(data.main.temp);
            }
          });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  } else {
    // !!!! NON CAPISCO PERCHE' NON VIENE VISUALIZZATO IL MESSAGGIO
    // SE NON ABILITO LA GEOLOCALIZZAZIONE !!!!
    notification.textContent(
      "Abilita la Geolocalizzazione per visualizzare il meteo della città in cui risiedi."
    );
  }
});

//ALL THE FUNCTIONS
//WILL PREVENT THE REFRESH
function search(e) {
  e.preventDefault();
}

//WILL SHOW THE FIRST LETTER TO UPPERCASE
function capitalized(word) {
  return word[0].toUpperCase() + word.slice(1);
}

//WILL SHOW ERROR
function displayError() {
  const alertDiv = document.createElement("div");
  alertDiv.innerHTML = "Inserisci il nome di una città valida";
  alertDiv.classList.add("alert");
  notification.appendChild(alertDiv);
}

//WILL CLEAR THE NOTIFICATION ON SCREEN
function clearAlert() {
  notification.innerHTML = " ";
}

//WILL CLEAR THE PAST RESEARCH OF WEATHER
function clearWeatherDisplay() {
  city.innerHTML = "-";
  temp.innerHTML = "? ";
  icon.innerHTML = `<img class="icon-dim" src="icons/unknown.svg" />`;
  desc.innerHTML = " ";
}
