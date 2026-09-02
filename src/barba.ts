import barba from "@barba/core";

import TransitionManager from "./components/transitions/TransitionManager";

/*
|--------------------------------------------------------------------------
| Active Page Transition
|--------------------------------------------------------------------------
|
| For normal pointer navigation, the transition starts BEFORE Barba
| begins its lifecycle.
|
| Barba then consumes that already-running transition in leave().
|
| For Back / Forward navigation, there is no pointerdown event, so
| leave() starts the normal navigation transition itself.
|
| IMPORTANT:
|
| Reload transitions are NOT stored here.
|
| A hard reload starts a completely new document and is handled
| by main.ts through:
|
|   playPageTransition("reload")
|
*/

let activePageTransition: {
  contentReady: Promise<void>;
  finished: Promise<void>;
} | null = null;

/*
|--------------------------------------------------------------------------
| Init Barba
|--------------------------------------------------------------------------
*/

const initBarba = (transitionManager: TransitionManager): void => {
  /*
  |--------------------------------------------------------------------------
  | Start Transition On Pointer Down
  |--------------------------------------------------------------------------
  |
  | This behavior comes from the working hosted version.
  |
  | The curtain begins moving BEFORE Barba starts replacing containers.
  |
  */

  document.addEventListener(
    "pointerdown",
    (event: PointerEvent) => {
      /*
      |--------------------------------------------------------------------------
      | Only Primary Mouse Button
      |--------------------------------------------------------------------------
      */

      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Find Clicked Link
      |--------------------------------------------------------------------------
      */

      const target = event.target as HTMLElement;

      const link = target.closest("a") as HTMLAnchorElement | null;

      if (!link) {
        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Internal Links Only
      |--------------------------------------------------------------------------
      */

      if (link.origin !== window.location.origin) {
        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Ignore Special Links
      |--------------------------------------------------------------------------
      */

      if (link.target && link.target !== "_self") {
        return;
      }

      if (link.hasAttribute("download")) {
        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Current / Destination URLs
      |--------------------------------------------------------------------------
      */

      const current = new URL(window.location.href);

      const destination = new URL(link.href);

      /*
      |--------------------------------------------------------------------------
      | Same Page
      |--------------------------------------------------------------------------
      |
      | Same-page navigation is intentionally treated as a real reload.
      |
      | main.ts will detect the resulting page load and run:
      |
      |   playPageTransition("reload")
      |
      */

      if (destination.href === current.href) {
        window.location.reload();

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Different Internal Page
      |--------------------------------------------------------------------------
      |
      | Start the NORMAL navigation transition immediately.
      |
      | Barba will consume this transition later in leave().
      |
      */

      activePageTransition = transitionManager.playPageTransition();
    },
    true,
  );

  /*
  |--------------------------------------------------------------------------
  | Barba
  |--------------------------------------------------------------------------
  */

  barba.init({
    debug: true,

    /*
    |--------------------------------------------------------------------------
    | Prevent Running
    |--------------------------------------------------------------------------
    |
    | Prevent another Barba transition from starting while one is
    | already running.
    |
    */

    preventRunning: true,

    transitions: [
      {
        name: "page-transition",

        /*
        |--------------------------------------------------------------------------
        | LEAVE
        |--------------------------------------------------------------------------
        */

        async leave(data) {
          console.log(
            "[Barba] LEAVE:",
            data.current.namespace,
            "→",
            data.next.namespace,
          );

          /*
          |--------------------------------------------------------------------------
          | Existing Transition
          |--------------------------------------------------------------------------
          |
          | Normal pointer navigation has already started the transition.
          |
          */

          if (activePageTransition) {
            const currentTransition = activePageTransition;

            /*
            |--------------------------------------------------------------------------
            | Consume Transition
            |--------------------------------------------------------------------------
            |
            | Clear the reference immediately so it cannot accidentally
            | be reused by another navigation.
            |
            */

            activePageTransition = null;

            /*
            |--------------------------------------------------------------------------
            | Wait Until Current Page Is Covered
            |--------------------------------------------------------------------------
            |
            | Barba can now safely proceed with its container lifecycle.
            |
            */

            await currentTransition.contentReady;

            return;
          }

          /*
          |--------------------------------------------------------------------------
          | Back / Forward
          |--------------------------------------------------------------------------
          |
          | Browser history navigation does not generate our pointerdown
          | event.
          |
          | Therefore start the NORMAL navigation transition here.
          |
          */

          const currentTransition = transitionManager.playPageTransition();

          /*
          |--------------------------------------------------------------------------
          | No Active Pointer Transition
          |--------------------------------------------------------------------------
          */

          activePageTransition = null;

          /*
          |--------------------------------------------------------------------------
          | Wait Until Current Page Is Covered
          |--------------------------------------------------------------------------
          */

          await currentTransition.contentReady;
        },

        /*
        |--------------------------------------------------------------------------
        | ENTER
        |--------------------------------------------------------------------------
        */

        async enter(data) {
          console.log("[Barba] ENTER:", data.next.namespace);

          /*
          |--------------------------------------------------------------------------
          | IMPORTANT
          |--------------------------------------------------------------------------
          |
          | Do NOT start another transition here.
          |
          | The transition is already running outside the Barba containers.
          |
          */
        },

        /*
        |--------------------------------------------------------------------------
        | AFTER ENTER
        |--------------------------------------------------------------------------
        */

        async afterEnter() {
          /*
          |--------------------------------------------------------------------------
          | Reset Native Browser Scroll
          |--------------------------------------------------------------------------
          */

          window.scrollTo(0, 0);
        },
      },
    ],
  });
};

export default initBarba;
