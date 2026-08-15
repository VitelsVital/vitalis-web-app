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
  | 2. Completion Pause
  |--------------------------------------------------------------------------
  |
  | Give the user a brief moment to register:
  |
  | VITALIS MULWA
  | 100%
  |
  */

  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 380);
  });

  /*
  |--------------------------------------------------------------------------
  | 3. Loader → Page Transition Handoff
  |--------------------------------------------------------------------------
  |
  | The loader content gets a 50ms head start.
  |
  | 0ms:
  |   VITALIS MULWA + 100 start moving upward.
  |
  | 50ms:
  |   PageTransition starts.
  |
  | The progress line remains stationary.
  |
  */

  const loadingExit = loading.transitionOut();

  /*
  |--------------------------------------------------------------------------
  | 4. 50ms Handoff Offset
  |--------------------------------------------------------------------------
  |
  | This creates the slight visual overlap between the
  | loading content leaving and PageTransition taking over.
  |
  */

  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 150);
  });

  /*
  |--------------------------------------------------------------------------
  | 5. Start Page Transition
  |--------------------------------------------------------------------------
  |
  | PageTransition now moves over the loading screen.
  |
  */

  const transition = pageTransition.play();

  /*
  |--------------------------------------------------------------------------
  | 6. Wait Until PageTransition Has Taken Over
  |--------------------------------------------------------------------------
  |
  | CONTENT_TIME determines when the transition has
  | physically covered the loading screen.
  |
  */

  await transition.contentReady;

  /*
  |--------------------------------------------------------------------------
  | 7. Remove Loading Screen
  |--------------------------------------------------------------------------
  |
  | The transition is now covering the loader.
  |
  | Removing it here cannot expose the page underneath.
  |
  */

  loading.remove();

  /*
  |--------------------------------------------------------------------------
  | 8. Wait For Loader Exit
  |--------------------------------------------------------------------------
  |
  | Normally this will already be complete, but awaiting it
  | guarantees the handoff animation has finished.
  |
  */

  await loadingExit;

  /*
  |--------------------------------------------------------------------------
  | 9. Wait For Page Transition To Finish
  |--------------------------------------------------------------------------
  */

  await transition.finished;

  /*
  |--------------------------------------------------------------------------
  | 10. Reset Scroll
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
  | 11. Start Lenis
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
