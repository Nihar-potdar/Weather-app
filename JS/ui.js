import { fetchWeather } from "./api.js";
import {
  hourlyContainer,
  cityElement,
  inputSearch,
  suggestions,
  tempElement,
  errorElement,
  loader,
  FAV_KEY,
} from "./dom.js";

import { favsbtn, showfavourites } from "./storage.js";

import { weatherIcons, background } from "./dom.js";

export function showWelcomeState() {
  const cities = ["London", "Dubai", "Torronto", "Tokyo"];

  hourlyContainer.innerHTML = "";

  cities.forEach((city) => {
    const div = document.createElement("div");

    div.classList.add("quick-city");

    div.innerHTML = `
        <span>${city}</span>
    `;

    div.addEventListener("click", () => {
      quickSearch(city);
    });

    hourlyContainer.appendChild(div);
  });
}

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

export function quickSearch(city) {
  inputSearch.value = city;
  fetchWeather(city);
}

export function renderHourlyForecast(hours) {
  // hourlyContainer.innerHTML = "";

  // hours.forEach((hour) => {
  //   const card = document.createElement("div");

  //   card.classList.add("hour-card");

  //   const icon = weatherIcons[hour.icon] || "🌍";

  //   const shortCondition =
  //     hour.conditions.length > 12
  //       ? hour.conditions.slice(0, 12) + "..."
  //       : hour.conditions;

  //   card.innerHTML = `
  //     <h1>${icon}</h1>
  //     <p class="time">${hour.datetime.slice(0, 5)}</p>
  //     <h3 class="temperature">${hour.temp}°C</h3>
  //     <p class="condition">${shortCondition}</p>
  //   `;

  //   hourlyContainer.appendChild(card);
  // });


  const html = hours.map(hour => {
    const icon = weatherIcons[hour.icon] || "🌍";
    const shortCondition =
      hour.conditions.length > 12
        ? hour.conditions.slice(0, 12) + "..."
        : hour.conditions;

    return `<div class="hour-card"> 
        <div class="weather-icon">${icon}</div>
         <p class="time">${hour.datetime.slice(0, 5)}</p>
         <h3 class="temperature">${hour.temp}°C</h3>
         <p class="condition">${shortCondition}</p>
       </div>`;
  }).join('');

  hourlyContainer.innerHTML = html; // singel DOM write
}

export function renderDailyForecast(days) {
  
  // dailyforecast.innerHTML = "";
  
  // days.slice(0, 7).forEach((day) => {
    //   const card = document.createElement("div");
    
    //   card.classList.add("daycard");
    
    //   const icon = weatherIcons[day.icon] || "🌍";
    
    //   const dayName = new Date(day.datetime).toLocaleDateString("en-US", {
      //     weekday: "short",
      //   });
      
      //   const shortConditions =
      //     day.conditions.length > 12
      //       ? day.conditions.slice(0, 12) + `..`
      //       : day.conditions;
      
      //   card.innerHTML = `
      //   <h3 class = "dayName">${dayName}</h3>
      //   <h1>${icon}</h1>
      //   <p>${day.temp}°C</p>
      //   <span>${shortConditions}</span>  
      //   `;
      
      //   dailyforecast.appendChild(card);
      // });
      
      
    const dailyforecast = document.querySelector(".dayforecast");
    const html = days.slice(0, 7).map(day => {
    const icon = weatherIcons[day.icon] || "🌍";
    const dayName = new Date(day.datetime).toLocaleDateString("en-US", {
      weekday: "short",
    });
    const shortConditions =
      day.conditions.length > 12
        ? day.conditions.slice(0, 12) + `..`
        : day.conditions;

    return `
    <div class="daycard">
    <h3 class = "dayName">${dayName}</h3>
    <p>${day.temp}°C</p>
    <div class="weather-icon">${icon}</div>
    <span class="condition">${shortConditions}</span> 
    </div>
    `
  }).join('');

  dailyforecast.innerHTML = html;
}

// export function updateBackground(condition) {
//   condition = condition.toLowerCase();

//   const backgrounds = {
//     rain: "rain.jpg",
//     clear: "clear.jpg",
//     cloud: "cloudy.jpg",
//     overcast: "cloudy.jpg",
//     snow: "snow.jpg",
//   };

//   for (let key in backgrounds) {
//     if (condition.includes(key)) {
//       background.style.backgroundImage = `url('${backgrounds[key]}')`;

//       break;
//     }
//   }
// }

export function showLoader() {
  loader.classList.remove("hidden");
}

export function hideLoader() {
  loader.classList.add("hidden");
}

export function showErrorMessage(message) {
  const toast = document.createElement("div");
  toast.classList.add("error-toast");
  toast.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

let favouritesOpen = false;

export function toggleFavourites() {
    const dropdown = document.querySelector('.favourites-dropdown');
    if (!dropdown) return;

    dropdown.classList.toggle('active')

    if (dropdown.classList.contains('active')) {
      showfavourites();
    } else {
      dropdown.innerHTML = '';
    }
}