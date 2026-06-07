import {
  hourlyContainer,
  cityElement,
  inputSearch,
  suggestions,
  tempElement,
  errorElement,
  weather,
} from "./dom.js";

import {
  showLoader,
  hideLoader,
  renderHourlyForecast,
  renderDailyForecast,
  showSuggestions,
} from "./ui.js";

// updateBackground,
import { recents, showRecentSearches } from "./storage.js";

const weatherCache = new Map();

export async function fetchWeather(city) {
  if (!city) return;

  if (weatherCache.has(city.toLowerCase())) {
    const data = weatherCache.get(city.toLowerCase());
    renderWeather(data);
    return;
  }

  errorElement.innerHTML = "";
  const api_url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=FV99HJ4VMSC46BGXWCQ7WAN76&days=7&elements=datetime,temp,conditions,icon,hours`;
  try {
        showLoader();
        const response = await fetch(api_url);

        if (!response.ok) {
          throw new Error("City not found");
        }
        const data = await response.json();

        recents(data.address);
        showRecentSearches();
        renderDailyForecast(data.days);
        weatherCache.set(city.toLowerCase(), data), // cache it
        renderWeather(data)

        console.log(data);
  } catch (error) {
      errorElement.innerHTML = `
          <h2>City not found</h2>
          <p>Please enter a valid city name.</p>
          `;
    console.log(error);
  } finally {
        hideLoader();
  }
}

const suggestionCache = new Map();

export async function fetchCitySuggestions(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&addressdetails=1&limit=8&format=json`;

  const key = query.toLowerCase();

  if(suggestionCache.has(key)) {
    showSuggestions(suggestionCache.get(key), fetchWeather);
    return;
  }

  const res = await fetch(url);
  const data = await res.json();
  suggestionCache.set(key, data)
  showSuggestions(data, fetchWeather);
}

export function renderWeather(data) {
  hourlyContainer.innerHTML = "";
  cityElement.textContent = data.address;
  inputSearch.value = "";
  suggestions.innerHTML = "";
  tempElement.textContent = `${data.days[0].temp}°C`;
  renderHourlyForecast(data.days[0].hours);
  // updateBackground(data.days[0].conditions);
  errorElement.innerHTML = "";
}
