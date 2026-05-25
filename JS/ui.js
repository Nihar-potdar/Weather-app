import { fetchWeather } from "./api.js";
import {
    hourlyContainer,
    cityElement,
    inputSearch,
    suggestions,
    tempElement,
    errorElement,
    loader
} from "./dom.js"

import { weatherIcons, background } from "./dom.js";

export function showWelcomeState() {


    const cities = [
        "London",
        "Dubai",
        "Torronto",
        "Tokyo"
    ]

    hourlyContainer.innerHTML = "";

    cities.forEach(city => {

    const div = document.createElement('div');
    
    div.classList.add('quick-city');

    div.innerHTML = `
        <span>${city}</span>
    `

    div.addEventListener('click', () => {
        quickSearch(city);
    });

    hourlyContainer.appendChild(div);

    });
}
//   cityElement.innerHTML = `<div class="welcome-icon">🌤️</div>`;
//   tempElement.innerHTML = `<p class="welcome-title">What's the weather like?</p>`;
//   document.querySelector(".condition").textContent =
//     "Search a city to see the forecast";
//   hourlyContainer.innerHTML = `
//     <div class="quick-city" onclick="quickSearch('London')">🌧️<span>London</span></div>
//     <div class="quick-city" onclick="quickSearch('Dubai')">☀️<span>Dubai</span></div>
//     <div class="quick-city" onclick="quickSearch('Toronto')">❄️<span>Toronto</span></div>
//     <div class="quick-city" onclick="quickSearch('Tokyo')">🌸<span>Tokyo</span></div>
//   `;


export function showSuggestions(cities, fetchWeather) {
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




export function quickSearch(city, fetchWeather) {
  inputSearch.value = city;
  fetchWeather(city);
}

export function renderHourlyForecast(hours) {
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


export function renderDailyForecast(days) {
  const dailyforecast = document.querySelector(".dayforecast");

  dailyforecast.innerHTML = "";

  days.slice(0, 7).forEach((day) => {
    const card = document.createElement("div");

    card.classList.add("daycard");

    const icon = weatherIcons[day.icon] || "🌍";

    const dayName = new Date(day.datetime)
      .toLocaleDateString('en-US', {weekday: "short"});

    const shortConditions = day.conditions.length > 12
      ? day.conditions.slice(0,12) + `..`
      : day.conditions;

    card.innerHTML = `
    <h3 class = "dayName">${dayName}</h3>
    <h1>${icon}</h1>
    <p>${day.temp}°C</p>
    <span>${shortConditions}</span>  
    `;

    dailyforecast.appendChild(card);
  });
}

export function updateBackground(condition) {
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


export function showLoader() {
  loader.classList.remove("hidden");
}

export function hideLoader() {
  loader.classList.add("hidden");
}



