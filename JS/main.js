import { eventListener } from "./events.js";
import { showWelcomeState } from "./ui.js";
import { showfavourites,initFavourites } from "./storage.js";

//start the app

eventListener();
showWelcomeState();
initFavourites();
showfavourites();
