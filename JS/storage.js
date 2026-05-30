import {
    suggestions,
    FAV_KEY
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





export function favsbtn(city) {
    let favourites = JSON.parse(localStorage.getItem(FAV_KEY)) || []

    favourites = favourites.filter((item) => item != city);
    favourites.unshift(city);

    localStorage.setItem(FAV_KEY, JSON.stringify(favourites));


    console.log(favourites)
}


export function showfavourites() {
    const favourites = 
        JSON.parse(localStorage.getItem(FAV_KEY)) || [];

    const container = document.querySelector('.favourites');

        if (!container) return;

        container.innerHTML = "";

        favourites.forEach((city) => {

            const div = document.createElement('div');

            div.classList.add("favouritesContainer");
            div.classList.add("favContainerDisplay")

            div.textContent = city.toUpperCase();

            div.addEventListener("click", () => {
                fetchWeather(city);
              } )
              container.appendChild(div)
        }
      )
}
