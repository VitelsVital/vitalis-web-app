import "./styles/normalize.css";
import "./styles/globalstyles.css";
import "./styles/styles.css";
import "./styles/components.css";

import Navigation from "./components/navigation/Navigation";
import TransitionManager from "./components/transitions/TransitionManager";

import initBarba from "./barba";
import { initLenis } from "./lenis";

const startApplication = async (): Promise<void> => {
  /*
  |--------------------------------------------------------------------------
  | Lenis
  |--------------------------------------------------------------------------
  */

  initLenis();

  /*
  |--------------------------------------------------------------------------
  | Transition Manager
  |--------------------------------------------------------------------------
  */

  const transitionManager = new TransitionManager();

  /*
  |--------------------------------------------------------------------------
  | Navigation
  |--------------------------------------------------------------------------
  */

  const navigation = new Navigation(transitionManager);

  const main = document.querySelector("main");

  if (!main) {
    throw new Error("[Main] <main> element was not found.");
  }

  document.body.insertBefore(navigation.render(), main);

  /*
  |--------------------------------------------------------------------------
  | Barba
  |--------------------------------------------------------------------------
  */

  initBarba(transitionManager);

  /*
  |--------------------------------------------------------------------------
  | Initial Page Boot
  |--------------------------------------------------------------------------
  |
  | EVERY page uses the LoadingScreen on initial document load.
  |
  | This includes:
  |
  | - Homepage
  | - Work
  | - About
  | - Contact
  | - Archive
  |
  | The purpose of this experiment is to establish one identical
  | initial-entry sequence across the entire application.
  |
  */

  await transitionManager.playLoadingScreen();

  /*
  |--------------------------------------------------------------------------
  | Exit Loading Screen
  |--------------------------------------------------------------------------
  |
  | LoadingScreen.exit() starts the shared TransitionLayer curtains.
  |
  */

  await transitionManager.exitLoadingScreen();
};

startApplication();
