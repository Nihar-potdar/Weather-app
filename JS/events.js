import {
    inputSearch,
    suggestions,
    search
} from "./dom.js";

import { fetchWeather, fetchCitySuggestions } from "./api.js";
import { showWelcomeState, showLoader } from "./ui.js";
import { showRecentSearches } from "./storage.js";


export function eventListener() {

document.addEventListener("click", (e) => {
  if (!e.target.closest(".search") && !e.target.closest(".suggestions")) {
    suggestions.innerHTML = "";
  }
});


inputSearch.addEventListener("focus", () => {
  if (inputSearch.value.trim() === "") {
    showRecentSearches();
  }
});


window.addEventListener("load", () => {
  if (!navigator.geolocation) return;

  showLoader();

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
      const res = await fetch(url);
      const data = await res.json();

      const city =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.county;

      if (city) {
        inputSearch.value = city;
        fetchWeather(city);
      } else {
        fetchWeather(`${latitude},${longitude}`);
      }
    },
    (error) => {
      // USer denid of location unavailable - just show welcome state silently
      console.log("location not available", error.message);
      showWelcomeState();
    },
    {
      timeout: 10000,
      maximumAge: 60000,
    },
  );
});


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


search.addEventListener("click", () => {
  const city = inputSearch.value.trim();

  if (city === "") return;

  fetchWeather(city);
  suggestions.innerHTML = "";
});

}