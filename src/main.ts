import "./styles/normalize.css";
import "./styles/globalstyles.css";
import "./styles/styles.css";
import "./styles/components.css";

import Navigation from "./components/navigation/Navigation";
import { initBarba } from "./barba";
import { initLenis } from "./lenis";

/*
|--------------------------------------------------------------------------
| Browser Scroll Restoration
|--------------------------------------------------------------------------
|
| Prevent the browser from restoring the previous scroll position
| when the page is refreshed or navigated with Back / Forward.
|
*/

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

/*
|--------------------------------------------------------------------------
| Initial Scroll Position
|--------------------------------------------------------------------------
|
| Always start the application from the top.
|
*/

window.scrollTo(0, 0);

/*
|--------------------------------------------------------------------------
| Lenis
|--------------------------------------------------------------------------
|
| Initialize Lenis once and keep the same instance throughout
| the lifetime of the application.
|
*/

const lenis = initLenis();

/*
|--------------------------------------------------------------------------
| Navigation
|--------------------------------------------------------------------------
*/

const navigation = new Navigation();

document.body.prepend(navigation.render());

/*
|--------------------------------------------------------------------------
| Barba container
|--------------------------------------------------------------------------
*/

const app = document.querySelector<HTMLElement>('[data-barba="container"]');

if (!app) {
  throw new Error('[data-barba="container"] element not found.');
}

/*
|--------------------------------------------------------------------------
| Initialize Barba
|--------------------------------------------------------------------------
*/

initBarba(lenis);
