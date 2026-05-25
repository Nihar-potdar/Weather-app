import {
    hourlyContainer,
    cityElement,
    inputSearch,
    suggestions,
    tempElement,
    errorElement
} from "./dom.js"

import {
  showLoader,
  hideLoader,
  renderHourlyForecast,
  renderDailyForecast,
  updateBackground,
  showSuggestions
} from "./ui.js";

import { recents, showRecentSearches } from "./storage.js";


export async function fetchWeather(city) {
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

    recents(data.address);
    showRecentSearches();
    renderDailyForecast(data.days);

    hourlyContainer.innerHTML = "";
    cityElement.textContent = data.address;
    inputSearch.value = "";
    suggestions.innerHTML = "";
    tempElement.textContent = `${data.days[0].temp}°C`;
    renderHourlyForecast(data.days[0].hours);
    updateBackground(data.days[0].conditions);
    errorElement.innerHTML = "";

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

export async function fetchCitySuggestions(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&addressdetails=1&limit=8&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  showSuggestions(data, fetchWeather);
}