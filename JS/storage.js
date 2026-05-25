import {
    suggestions
} from "./dom.js"

import { fetchWeather } from "./api.js";


export function recents(city) {
  let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];

  recentSearches = recentSearches.filter((item) => item != city);

  recentSearches.unshift(city);

  recentSearches = recentSearches.slice(0, 4);

  localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
}

export function showRecentSearches() {
  const recentSearches =
    JSON.parse(localStorage.getItem("recentSearches")) || [];

  suggestions.innerHTML = "";

  recentSearches.forEach((city) => {
    const div = document.createElement("div");

    div.classList.add("suggestion-item");

    div.textContent = city;

    div.addEventListener("click", () => {
      fetchWeather(city);
    });

    suggestions.appendChild(div);
  });
}