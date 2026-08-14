// import "./styles/normalize.css";
// import "./styles/globalstyles.css";
// import "./styles/styles.css";
// import "./styles/components.css";

// import Navigation from "./components/navigation/Navigation";
// import LoadingScreen from "./components/loading/LoadingScreen";

// import PageTransition from "./components/transitions/page/PageTransition";

// import { initBarba } from "./barba";
// import { initLenis } from "./lenis";

// /*
// |--------------------------------------------------------------------------
// | Browser Scroll Restoration
// |--------------------------------------------------------------------------
// |
// | Prevent the browser from restoring the previous scroll position
// | when refreshing or using Back / Forward navigation.
// |
// */

// if ("scrollRestoration" in history) {
//   history.scrollRestoration = "manual";
// }

// /*
// |--------------------------------------------------------------------------
// | Initial Scroll Position
// |--------------------------------------------------------------------------
// |
// | Always start the application from the top.
// |
// */

// window.scrollTo(0, 0);

// /*
// |--------------------------------------------------------------------------
// | Lenis
// |--------------------------------------------------------------------------
// |
// | Initialize Lenis once for the entire application.
// |
// */

// const lenis = initLenis();

// /*
// |--------------------------------------------------------------------------
// | Stop Lenis During Loading
// |--------------------------------------------------------------------------
// |
// | The loading screen owns the viewport until the initial
// | loading and page transition sequence has completed.
// |
// */

// lenis.stop();

// /*
// |--------------------------------------------------------------------------
// | Navigation
// |--------------------------------------------------------------------------
// */

// const navigation = new Navigation();

// document.body.prepend(navigation.render());

// /*
// |--------------------------------------------------------------------------
// | Barba Container
// |--------------------------------------------------------------------------
// */

// const app = document.querySelector<HTMLElement>('[data-barba="container"]');

// if (!app) {
//   throw new Error('[data-barba="container"] element not found.');
// }

// /*
// |--------------------------------------------------------------------------
// | Loading Screen
// |--------------------------------------------------------------------------
// */

// const loading = new LoadingScreen();

// document.body.append(loading.render());

// /*
// |--------------------------------------------------------------------------
// | Page Transition
// |--------------------------------------------------------------------------
// |
// | One PageTransition instance is shared between:
// |
// | - Initial loading
// | - Barba navigation
// | - Back / Forward navigation
// | - Refresh transitions
// |
// */

// const pageTransition = new PageTransition();

// /*
// |--------------------------------------------------------------------------
// | Initialize Barba
// |--------------------------------------------------------------------------
// |
// | Barba is initialized before the loading sequence finishes.
// |
// */

// initBarba(lenis, pageTransition);

// /*
// |--------------------------------------------------------------------------
// | Application Bootstrap
// |--------------------------------------------------------------------------
// */

// const startApplication = async (): Promise<void> => {
//   /*
//     |--------------------------------------------------------------------------
//     | 1. Loading
//     |--------------------------------------------------------------------------
//     |
//     | The loading screen animates:
//     |
//     | - Top progress line
//     | - VITALIS MULWA reveal
//     | - Percentage counter
//     |
//     | play() resolves exactly at 100%.
//     |
//     */

//   await loading.play();

//   /*
//     |--------------------------------------------------------------------------
//     | 2. Completion Pause
//     |--------------------------------------------------------------------------
//     |
//     | Give the user a brief moment to register:
//     |
//     | VITALIS MULWA
//     | 100%
//     |
//     | before the PageTransition takes over.
//     |
//     | 350ms creates a deliberate separation between
//     | the loading experience and the page transition.
//     |
//     */

//   await new Promise<void>((resolve) => {
//     window.setTimeout(resolve, 350);
//   });

//   /*
//     |--------------------------------------------------------------------------
//     | 3. Start Page Transition
//     |--------------------------------------------------------------------------
//     |
//     | The loader is STILL visible.
//     |
//     | PageTransition now moves over the loader and
//     | takes ownership of the viewport.
//     |
//     */

//   const transition = pageTransition.play();

//   /*
//     |--------------------------------------------------------------------------
//     | 4. Animate Loader Handoff
//     |--------------------------------------------------------------------------
//     |
//     | At the exact moment PageTransition starts:
//     |
//     | - VITALIS MULWA moves upward
//     | - 100% moves upward
//     |
//     | The progress line remains in place.
//     |
//     */

//   loading.transitionOut();

//   /*
//     |--------------------------------------------------------------------------
//     | 5. Wait Until PageTransition Has Taken Over
//     |--------------------------------------------------------------------------
//     |
//     | CONTENT_TIME determines when the transition has
//     | covered the loading screen.
//     |
//     */

//   await transition.contentReady;

//   /*
//     |--------------------------------------------------------------------------
//     | 6. Remove Loading Screen
//     |--------------------------------------------------------------------------
//     |
//     | The transition is now physically covering the loader.
//     |
//     | Removing it here cannot expose the page underneath.
//     |
//     */

//   loading.remove();

//   /*
//     |--------------------------------------------------------------------------
//     | 7. Wait For Page Transition To Finish
//     |--------------------------------------------------------------------------
//     */

//   await transition.finished;

//   /*
//     |--------------------------------------------------------------------------
//     | 8. Reset Scroll
//     |--------------------------------------------------------------------------
//     |
//     | Make absolutely sure the first visible page starts
//     | at the top.
//     |
//     */

//   window.scrollTo(0, 0);

//   lenis.scrollTo(0, {
//     immediate: true,
//   });

//   /*
//     |--------------------------------------------------------------------------
//     | 9. Start Lenis
//     |--------------------------------------------------------------------------
//     */

//   lenis.start();
// };

// /*
// |--------------------------------------------------------------------------
// | Start Application
// |--------------------------------------------------------------------------
// */

// startApplication();

import "./styles/normalize.css";
import "./styles/globalstyles.css";
import "./styles/styles.css";
import "./styles/components.css";

import Navigation from "./components/navigation/Navigation";
import LoadingScreen from "./components/loading/LoadingScreen";

import PageTransition from "./components/transitions/page/PageTransition";

import { initBarba } from "./barba";
import { initLenis } from "./lenis";

/*
|--------------------------------------------------------------------------
| Browser Scroll Restoration
|--------------------------------------------------------------------------
|
| Prevent the browser from restoring the previous scroll position
| when refreshing or using Back / Forward navigation.
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
| Initialize Lenis once for the entire application.
|
*/

const lenis = initLenis();

/*
|--------------------------------------------------------------------------
| Stop Lenis During Loading
|--------------------------------------------------------------------------
|
| The loading screen owns the viewport until the initial
| loading and page transition sequence has completed.
|
*/

lenis.stop();

/*
|--------------------------------------------------------------------------
| Navigation
|--------------------------------------------------------------------------
*/

const navigation = new Navigation();

document.body.prepend(navigation.render());

/*
|--------------------------------------------------------------------------
| Barba Container
|--------------------------------------------------------------------------
*/

const app = document.querySelector<HTMLElement>('[data-barba="container"]');

if (!app) {
  throw new Error('[data-barba="container"] element not found.');
}

/*
|--------------------------------------------------------------------------
| Loading Screen
|--------------------------------------------------------------------------
*/

const loading = new LoadingScreen();

document.body.append(loading.render());

/*
|--------------------------------------------------------------------------
| Page Transition
|--------------------------------------------------------------------------
|
| One PageTransition instance is shared between:
|
| - Initial loading
| - Barba navigation
| - Back / Forward navigation
| - Refresh transitions
|
*/

const pageTransition = new PageTransition();

/*
|--------------------------------------------------------------------------
| Initialize Barba
|--------------------------------------------------------------------------
|
| Barba is initialized before the loading sequence finishes.
|
*/

initBarba(lenis, pageTransition);

/*
|--------------------------------------------------------------------------
| Application Bootstrap
|--------------------------------------------------------------------------
*/

const startApplication = async (): Promise<void> => {
  /*
    |--------------------------------------------------------------------------
    | 1. Loading
    |--------------------------------------------------------------------------
    |
    | The loading screen animates:
    |
    | - Top progress line
    | - VITALIS MULWA reveal
    | - Percentage counter
    |
    | play() resolves exactly at 100%.
    |
    */

  await loading.play();

  /*
    |--------------------------------------------------------------------------
    | DEBUG — STOP LOADER
    |--------------------------------------------------------------------------
    |
    | The loader will remain visible at exactly 100%.
    |
    | This allows you to inspect:
    |
    | - Loader dimensions
    | - VITALIS MULWA positioning
    | - Counter positioning
    | - Progress line positioning
    | - Centering
    | - Spacing
    |
    | PageTransition will NOT start.
    | Loader will NOT be removed.
    | Lenis will remain stopped.
    |
    | REMOVE THIS "return;" WHEN DEBUGGING IS FINISHED.
    |
    */

  return;

  /*
    |--------------------------------------------------------------------------
    | 2. Completion Pause
    |--------------------------------------------------------------------------
    |
    | Give the user a brief moment to register:
    |
    | VITALIS MULWA
    | 100%
    |
    | before the PageTransition takes over.
    |
    */

  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 350);
  });

  /*
    |--------------------------------------------------------------------------
    | 3. Start Page Transition
    |--------------------------------------------------------------------------
    |
    | The loader is STILL visible.
    |
    | PageTransition now moves over the loader and
    | takes ownership of the viewport.
    |
    */

  const transition = pageTransition.play();

  /*
    |--------------------------------------------------------------------------
    | 4. Animate Loader Handoff
    |--------------------------------------------------------------------------
    |
    | Lift the name and counter upward as the
    | page transition begins.
    |
    */

  loading.transitionOut();

  /*
    |--------------------------------------------------------------------------
    | 5. Wait Until PageTransition Has Taken Over
    |--------------------------------------------------------------------------
    */

  await transition.contentReady;

  /*
    |--------------------------------------------------------------------------
    | 6. Remove Loading Screen
    |--------------------------------------------------------------------------
    |
    | The transition is now physically covering the loader.
    |
    */

  loading.remove();

  /*
    |--------------------------------------------------------------------------
    | 7. Wait For Page Transition To Finish
    |--------------------------------------------------------------------------
    */

  await transition.finished;

  /*
    |--------------------------------------------------------------------------
    | 8. Reset Scroll
    |--------------------------------------------------------------------------
    |
    | Make absolutely sure the first visible page starts
    | at the top.
    |
    */

  window.scrollTo(0, 0);

  lenis.scrollTo(0, {
    immediate: true,
  });

  /*
    |--------------------------------------------------------------------------
    | 9. Start Lenis
    |--------------------------------------------------------------------------
    */

  lenis.start();
};

/*
|--------------------------------------------------------------------------
| Start Application
|--------------------------------------------------------------------------
*/

startApplication();
