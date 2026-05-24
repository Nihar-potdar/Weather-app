import lottie from 'lottie-web';
import rainAnimation from '@meteocons/lottie/fill/clearDay.json';


const search = document.querySelector(".searchbtn button");

const inputSearch = document.querySelector("#search");

const cityElement = document.querySelector(".city");

const tempElement = document.querySelector(".temp");

const hourlyContainer = document.querySelector(".hourlytemp");

const errorElement = document.querySelector(".error-message");

const loader = document.querySelector(".loading");

const background = document.querySelector(".background");

const suggestions = document.querySelector(".suggestions");

const weather = document.querySelector("#weather");

const weatherIcons = {
  "clear-day": "",
  "clear-night": "🌙",
  "rain": "🌧️",
  "snow": "❄️",
  "fog": "🌫️",
  "wind": "💨",
  "cloudy": "☁️",
  "partly-cloudy-day": "⛅",
  "partly-cloudy-night": "🌙",
};

function showWelcomeState() {
  cityElement.innerHTML = `<div class="welcome-icon">🌤️</div>`;
  tempElement.innerHTML = `<p class="welcome-title">What's the weather like?</p>`;
  document.querySelector(".condition").textContent =
    "Search a city to see the forecast";
  hourlyContainer.innerHTML = `
    <div class="quick-city" onclick="quickSearch('London')">🌧️<span>London</span></div>
    <div class="quick-city" onclick="quickSearch('Dubai')">☀️<span>Dubai</span></div>
    <div class="quick-city" onclick="quickSearch('Toronto')">❄️<span>Toronto</span></div>
    <div class="quick-city" onclick="quickSearch('Tokyo')">🌸<span>Tokyo</span></div>
  `;
}

function quickSearch(city) {
  inputSearch.value = city;
  fetchWeather(city);
}

async function fetchWeather(city) {
  if (!city) return;
  errorElement.innerHTML = "";
  const api_url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=FV99HJ4VMSC46BGXWCQ7WAN76`;
  try {
    showLoader();
    const response = await fetch(api_url);

    if (!response.ok) {
      throw new Error("City not found");
    }
    const data = await response.json();
    hourlyContainer.innerHTML = "";
    cityElement.textContent = data.address;
    tempElement.textContent = `${data.days[0].temp}°C`;
    renderHourlyForecast(data.days[0].hours);
    updateBackground(data.days[0].conditions);
    errorElement.innerHTML = "";
  } catch (error) {
    errorElement.innerHTML = `
        <h2>City not found</h2>
        <p>Please enter a valid city name.</p>
        `;
  } finally {
    hideLoader();
  }
}

search.addEventListener("click", () => {
  const city = inputSearch.value;

  if (city === "") return;

  fetchWeather(city);
  suggestions.innerHTML = "";
});

//KEYBOARD EVENT LISTENER

inputSearch.addEventListener("keydown", (e) => {
  const items = document.querySelectorAll(".suggestion-item");
  const active = document.querySelector(".suggestion-item.active");

  if (e.key === "ArrowDown") {
    e.preventDefault(); //stops page from scrolling
    if (active) {
      active.classList.remove("active");
      const next = active.nextElementSibling;
      if (next) next.classList.add("active");
    } else {
      items[0]?.classList.add("active"); // highlight the first item
    }
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (active) {
      active.classList.remove("active");
      const previous = active.previousElementSibling;
      if (previous) previous.classList.add("active");
    }
  }

  if (e.key === "Enter") {
    if (active) {
      inputSearch.value = active.textContent; //fill input with highlighted item
      active.classList.remove("active");
      fetchWeather(inputSearch.value);
      suggestions.innerHTML = "";
    } else {
      fetchWeather(inputSearch.value);
    }
  }

  if (e.key === "Escape") {
    suggestions.innerHTML = ""; // close dropdown
  }
});

//DEBOUNCING

let debounceTimer;

inputSearch.addEventListener("input", () => {
  const value = inputSearch.value.trim();
  clearTimeout(debounceTimer);

  if (value.length < 2) {
    suggestions.innerHTML = "";
    return;
  }

  debounceTimer = setTimeout(() => {
    fetchCitySuggestions(value);
  }, 300);
});

//async

async function fetchCitySuggestions(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&addressdetails=1&limit=8&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  showSuggestions(data);
}

//Suggestions

function showSuggestions(cities) {
  suggestions.innerHTML = "";

  cities.forEach((city) => {
    const div = document.createElement("div");

    const cityName =
      city.address.city ||
      city.address.town ||
      city.address.village ||
      city.name;

    div.textContent = cityName;
    div.classList.add("suggestion-item");

    div.addEventListener("click", () => {
      inputSearch.value = cityName;
      suggestions.innerHTML = "";

      fetchWeather(cityName);
    });

    suggestions.appendChild(div);
  });
}

function renderHourlyForecast(hours) {
  hourlyContainer.innerHTML = "";

  hours.forEach((hour) => {
    const card = document.createElement("div");

    card.classList.add("hour-card");

    const icon = weatherIcons[hour.icon] || "🌍";

    const shortCondition =
      hour.conditions.length > 12
        ? hour.conditions.slice(0, 12) + "..."
        : hour.conditions;

    card.innerHTML = `
      <h1>${icon}</h1>
      <p class="time">${hour.datetime.slice(0, 5)}</p>
      <h3 class="temperature">${hour.temp}°C</h3>
      <p class="condition">${shortCondition}</p>
    `;

    hourlyContainer.appendChild(card);
  });
}

//dynamically changing background

function updateBackground(condition) {
  condition = condition.toLowerCase();

  const backgrounds = {
    rain: "rain.jpg",
    clear: "clear.jpg",
    cloud: "cloudy.jpg",
    overcast: "cloudy.jpg",
    snow: "snow.jpg",
  };

  for (let key in backgrounds) {
    if (condition.includes(key)) {
      background.style.backgroundImage = `url('${backgrounds[key]}')`;

      break;
    }
  }
}

function showLoader() {
  loader.classList.remove("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
}

//auto detect location


window.addEventListener('load', () => {

  if(!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    async(position) => {
      const {latitude, longitude} = position.coords;

      const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      const res = await fetch(url);
      const data = await res.json();

      const city =
      data.address.city ||
      data.address.town ||
      data.address.village ||
      data.address.county;

      if(city) {
        inputSearch.value = city;
        fetchWeather(city);
      }else {
        fetchWeather(`${latitude},${longitude}`);
      }
    },
    (error) => {
      // USer denid of location unavailable - just show welcome state silently
      console.log('location not available', error.message);
      showWelcomeState();
    },
    {
      timeout: 10000,
      maximumAge: 60000,
    }
  )
})


