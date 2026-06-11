import {
    suggestions,
    FAV_KEY
} from "./dom.js"

import { fetchWeather } from "./api.js";

import { toggleFavourites, showErrorMessage } from "./ui.js";


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
    favourites = favourites.slice(0, 5);

    localStorage.setItem(FAV_KEY, JSON.stringify(favourites));


    console.log(favourites)
}

export function initFavourites() {
  const favouriteBtn = document.querySelector('#favsBtn');
  if (favouriteBtn) {
    favouriteBtn.addEventListener('click', () => {
      toggleFavourites();
    });
  }
}


export function showfavourites() {

  try {
    const favourites =  JSON.parse(localStorage.getItem(FAV_KEY)) || [];  
    const dropdown = document.querySelector('.favourites-dropdown');

        if (!dropdown) throw new Error('dropdown not found!');

        dropdown.innerHTML = "";

        if (favourites.length === 0) {
          showErrorMessage('No favourites added yet!');
          return;
        }
    
        // const closebtn = document.createElement('div');
        // closebtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`
        // closebtn.classList.add('closeFavsBtn');
        // closebtn.addEventListener('click', (e) =>{ 
        //   toggleFavourites();
        //   e.stopPropagation();
        // });
        // container.appendChild(closebtn);

        favourites.forEach((city) => {
            const div = document.createElement('div');
            div.classList.add("favouritesContainer", "favContainerDisplay")

            div.innerHTML = `
            <span>${city.toUpperCase()}</span>
            <button class="removeFavsBtn" aria-label="Remove ${city}">
            <i class="fa-solid fa-x"></i>
            </button> `


            div.querySelector('.removeFavsBtn').addEventListener('click', (e) => {
              e.stopPropagation();
              removeFavourites(city);
            })

            div.addEventListener("click", () => { fetchWeather(city); }) 
              dropdown.appendChild(div)
        })

         } catch (error) {
      console.error('favourites error:', error.message);
    }

}

export function removeFavourites(city) {
  let favourites = JSON.parse(localStorage.getItem(FAV_KEY)) || [];
  favourites = favourites.filter((item) => item !== city);
  localStorage.setItem(FAV_KEY, JSON.stringify(favourites));
  showfavourites();
  
}

export function removeFavAll() {
      localStorage.removeItem(FAV_KEY);
      showfavourites();
}