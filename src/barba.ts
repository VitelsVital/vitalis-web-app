import barba from "@barba/core";
import type Lenis from "lenis";

import PageTransition from "./components/transitions/page/PageTransition";

export function initBarba(lenis: Lenis, transition: PageTransition): void {
  /*
    |--------------------------------------------------------------------------
    | Active Navigation
    |--------------------------------------------------------------------------
    |
    | Updates every navigation link that uses
    | data-link-status.
    |
    | This includes:
    |
    | - Main navigation
    | - Mobile navigation
    | - Any future navigation links
    |
    */

  const updateActiveLinks = (): void => {
    const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";

    const links = document.querySelectorAll<HTMLAnchorElement>(
      "a[data-link-status]",
    );

    links.forEach((link) => {
      const linkPath =
        new URL(link.href, window.location.origin).pathname.replace(
          /\/+$/,
          "",
        ) || "/";

      link.dataset.linkStatus =
        linkPath === currentPath ? "active" : "not-active";
    });
  };

  /*
    |--------------------------------------------------------------------------
    | Current Transition
    |--------------------------------------------------------------------------
    |
    | Stores the currently running transition so Barba
    | does not start another transition during normal
    | pointer-based navigation.
    |
    */

  let transitionRun: ReturnType<PageTransition["play"]> | null = null;

  /*
    |--------------------------------------------------------------------------
    | Refresh Detection
    |--------------------------------------------------------------------------
    */

  const navigationEntry = performance.getEntriesByType("navigation")[0] as
    PerformanceNavigationTiming | undefined;

  const isReload = navigationEntry?.type === "reload";

  /*
    |--------------------------------------------------------------------------
    | Refresh Transition
    |--------------------------------------------------------------------------
    |
    | On refresh, the loader in main.ts reaches 100% and
    | starts PageTransition directly.
    |
    | Therefore we DO NOT start another transition here.
    |
    */

  if (isReload) {
    requestAnimationFrame(() => {
      document.documentElement.classList.remove("is-refreshing");

      updateActiveLinks();
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Initial Active Navigation State
    |--------------------------------------------------------------------------
    */

  updateActiveLinks();

  /*
    |--------------------------------------------------------------------------
    | Start Transition On Pointer Down
    |--------------------------------------------------------------------------
    |
    | This starts the transition immediately when an internal
    | link is pressed.
    |
    */

  document.addEventListener(
    "pointerdown",
    (event: PointerEvent) => {
      /*
       * Only primary mouse button.
       */

      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      const target = event.target as HTMLElement;

      const link = target.closest("a") as HTMLAnchorElement | null;

      if (!link) {
        return;
      }

      /*
       * Internal links only.
       */

      if (link.origin !== window.location.origin) {
        return;
      }

      /*
       * Ignore special links.
       */

      if (link.target && link.target !== "_self") {
        return;
      }

      if (link.hasAttribute("download")) {
        return;
      }

      /*
            |--------------------------------------------------------------------------
            | Current And Destination URLs
            |--------------------------------------------------------------------------
            */

      const current = new URL(window.location.href);

      const destination = new URL(link.href);

      /*
            |--------------------------------------------------------------------------
            | Same Page Link
            |--------------------------------------------------------------------------
            |
            | Clicking a link pointing to the current page
            | behaves like a refresh.
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
            | Start the transition immediately.
            |
            */

      transitionRun = transition.play();
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

    preventRunning: true,

    transitions: [
      {
        name: "page-transition",

        /*
                |--------------------------------------------------------------------------
                | Leave
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
                    | Normal Internal Link
                    |--------------------------------------------------------------------------
                    |
                    | pointerdown has already started
                    | the PageTransition.
                    |
                    */

          if (transitionRun) {
            const currentTransition = transitionRun;

            transitionRun = null;

            /*
             * Allow Barba to continue when
             * CONTENT_TIME is reached.
             */

            await currentTransition.contentReady;

            return;
          }

          /*
                    |--------------------------------------------------------------------------
                    | Back / Forward
                    |--------------------------------------------------------------------------
                    |
                    | There was no pointerdown event.
                    |
                    | Start the same transition here.
                    |
                    */

          const currentTransition = transition.play();

          /*
           * Release new content at CONTENT_TIME.
           */

          await currentTransition.contentReady;
        },

        /*
                |--------------------------------------------------------------------------
                | Enter
                |--------------------------------------------------------------------------
                */

        async enter(data) {
          console.log("[Barba] ENTER:", data.next.namespace);

          /*
           * Update active navigation state
           * after the new page has entered.
           */

          updateActiveLinks();
        },

        /*
                |--------------------------------------------------------------------------
                | After Enter
                |--------------------------------------------------------------------------
                |
                | The new page is now active.
                |
                | Reset the browser and Lenis scroll position.
                |
                */

        async afterEnter() {
          /*
           * Reset native browser scroll.
           */

          window.scrollTo(0, 0);

          /*
           * Reset Lenis immediately.
           *
           * Do NOT use a smooth scroll here.
           * The new page should start at exactly 0.
           */

          lenis.scrollTo(0, {
            immediate: true,
          });
        },
      },
    ],
  });
}
