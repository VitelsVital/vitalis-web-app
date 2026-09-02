import gsap from "gsap";

import TransitionLayer from "../TransitionLayer";

export type PageTransitionMode = "navigation" | "reload";

class PageTransition {
  /*
  |--------------------------------------------------------------------------
  | Shared Transition Layer
  |--------------------------------------------------------------------------
  */

  private readonly layer: TransitionLayer;

  /*
  |--------------------------------------------------------------------------
  | Normal Navigation Timing
  |--------------------------------------------------------------------------
  */

  private readonly SCREEN_TWO_DURATION = 1.2;

  private readonly SCREEN_ONE_DURATION = 1.08;

  private readonly SCREEN_ONE_DELAY = 0.15;

  /*
  |--------------------------------------------------------------------------
  | Reload Timing
  |--------------------------------------------------------------------------
  |
  | Reload uses a different choreography.
  |
  | Screen One:
  |
  |   immediately covers the viewport.
  |
  | Screen Two:
  |
  |   starts below the viewport
  |   ↓
  |   moves into full coverage
  |   ↓
  |   takes over from Screen One
  |   ↓
  |   continues upward
  |
  */

  private readonly RELOAD_COVER_DURATION = 0.35;

  private readonly RELOAD_WIPE_DURATION = 1.2;

  /*
  |--------------------------------------------------------------------------
  | Constructor
  |--------------------------------------------------------------------------
  */

  constructor(layer: TransitionLayer) {
    this.layer = layer;
  }

  /*
  |--------------------------------------------------------------------------
  | Play
  |--------------------------------------------------------------------------
  */

  play(mode: PageTransitionMode = "navigation"): {
    contentReady: Promise<void>;
    finished: Promise<void>;
  } {
    /*
    |--------------------------------------------------------------------------
    | Reset
    |--------------------------------------------------------------------------
    */

    this.layer.reset();

    /*
    |--------------------------------------------------------------------------
    | Screens
    |--------------------------------------------------------------------------
    */

    const screenOne = this.layer.getScreenOne();

    const screenTwo = this.layer.getScreenTwo();

    /*
    |--------------------------------------------------------------------------
    | Show
    |--------------------------------------------------------------------------
    */

    this.layer.show();

    /*
    |--------------------------------------------------------------------------
    | Layering
    |--------------------------------------------------------------------------
    */

    gsap.set(screenOne, {
      zIndex: 1,
    });

    gsap.set(screenTwo, {
      zIndex: 2,
    });

    /*
    |--------------------------------------------------------------------------
    | Promises
    |--------------------------------------------------------------------------
    */

    let contentResolve: (() => void) | null = null;

    let finishedResolve: (() => void) | null = null;

    const contentReady = new Promise<void>((resolve) => {
      contentResolve = resolve;
    });

    const finished = new Promise<void>((resolve) => {
      finishedResolve = resolve;
    });

    /*
    |--------------------------------------------------------------------------
    | Reload Mode
    |--------------------------------------------------------------------------
    */

    if (mode === "reload") {
      return this.playReload(
        screenOne,
        screenTwo,
        contentResolve,
        finishedResolve,
        contentReady,
        finished,
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Normal Navigation Mode
    |--------------------------------------------------------------------------
    */

    return this.playNavigation(
      screenOne,
      screenTwo,
      contentResolve,
      finishedResolve,
      contentReady,
      finished,
    );
  }

  /*
  |--------------------------------------------------------------------------
  | NORMAL NAVIGATION
  |--------------------------------------------------------------------------
  |
  | This is the existing working Barba choreography.
  |
  */

  private playNavigation(
    screenOne: HTMLDivElement,
    screenTwo: HTMLDivElement,
    contentResolve: (() => void) | null,
    finishedResolve: (() => void) | null,
    contentReady: Promise<void>,
    finished: Promise<void>,
  ): {
    contentReady: Promise<void>;
    finished: Promise<void>;
  } {
    /*
    |--------------------------------------------------------------------------
    | Content Handoff State
    |--------------------------------------------------------------------------
    */

    let contentReleased = false;

    /*
    |--------------------------------------------------------------------------
    | Timeline
    |--------------------------------------------------------------------------
    */

    const timeline = gsap.timeline({
      onComplete: () => {
        this.layer.reset();

        this.layer.hide();

        finishedResolve?.();
      },
    });

    /*
    |--------------------------------------------------------------------------
    | SCREEN TWO
    |--------------------------------------------------------------------------
    |
    | +5% → -200%
    |
    */

    timeline.to(
      screenTwo,
      {
        yPercent: -200,
        duration: this.SCREEN_TWO_DURATION,
        ease: "power3.out",

        onUpdate: () => {
          if (contentReleased) {
            return;
          }

          const yPercent = Number(gsap.getProperty(screenTwo, "yPercent"));

          /*
          |--------------------------------------------------------------------------
          | Current Page Completely Covered
          |--------------------------------------------------------------------------
          */

          if (yPercent <= -100) {
            contentReleased = true;

            contentResolve?.();
          }
        },
      },
      0,
    );

    /*
    |--------------------------------------------------------------------------
    | SCREEN ONE
    |--------------------------------------------------------------------------
    |
    | +5% → -200%
    |
    */

    timeline.to(
      screenOne,
      {
        yPercent: -200,
        duration: this.SCREEN_ONE_DURATION,
        ease: "power3.out",
      },
      this.SCREEN_ONE_DELAY,
    );

    return {
      contentReady,
      finished,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | RELOAD MODE
  |--------------------------------------------------------------------------
  |
  | Visual sequence:
  |
  |   Current page
  |       ↓
  |   Screen One immediately covers viewport
  |       ↓
  |   Screen Two starts below viewport
  |       ↓
  |   Screen Two moves upward
  |       ↓
  |   Screen Two completely covers Screen One
  |       ↓
  |   Screen One is removed from the visual stack
  |       ↓
  |   Screen Two continues upward
  |       ↓
  |   Current page revealed
  |
  */

  private playReload(
    screenOne: HTMLDivElement,
    screenTwo: HTMLDivElement,
    contentResolve: (() => void) | null,
    finishedResolve: (() => void) | null,
    contentReady: Promise<void>,
    finished: Promise<void>,
  ): {
    contentReady: Promise<void>;
    finished: Promise<void>;
  } {
    /*
    |--------------------------------------------------------------------------
    | CRITICAL INITIAL STATE
    |--------------------------------------------------------------------------
    |
    | Screen One immediately covers the entire viewport.
    |
    | This is the reload safety cover.
    |
    */

    gsap.set(screenOne, {
      yPercent: 0,
      zIndex: 1,
    });

    /*
    |--------------------------------------------------------------------------
    | Screen Two
    |--------------------------------------------------------------------------
    |
    | Start completely below the viewport.
    |
    */

    gsap.set(screenTwo, {
      yPercent: 100,
      zIndex: 2,
    });

    /*
    |--------------------------------------------------------------------------
    | Content Is Already Covered
    |--------------------------------------------------------------------------
    |
    | There is no Barba container swap during a reload.
    |
    | The current page remains underneath.
    |
    */

    contentResolve?.();

    /*
    |--------------------------------------------------------------------------
    | Reload Timeline
    |--------------------------------------------------------------------------
    */

    const timeline = gsap.timeline({
      onComplete: () => {
        /*
        |--------------------------------------------------------------------------
        | Final Cleanup
        |--------------------------------------------------------------------------
        */

        this.layer.reset();

        this.layer.hide();

        finishedResolve?.();
      },
    });

    /*
    |--------------------------------------------------------------------------
    | STEP 1 — SCREEN TWO TAKES OVER
    |--------------------------------------------------------------------------
    |
    | Screen Two:
    |
    |   100% → 0%
    |
    | It travels from the bottom until it completely covers
    | Screen One.
    |
    */

    timeline.to(
      screenTwo,
      {
        yPercent: 0,
        duration: this.RELOAD_COVER_DURATION,
        ease: "power3.out",
      },
      0,
    );

    /*
    |--------------------------------------------------------------------------
    | STEP 2 — SCREEN ONE DISAPPEARS
    |--------------------------------------------------------------------------
    |
    | Screen Two now owns the entire viewport.
    |
    | Screen One can safely be hidden/reset.
    |
    */

    timeline.call(
      () => {
        gsap.set(screenOne, {
          yPercent: 5,
        });
      },
      [],
      `+=0`,
    );

    /*
    |--------------------------------------------------------------------------
    | STEP 3 — SCREEN TWO WIPES UPWARD
    |--------------------------------------------------------------------------
    |
    | Screen Two:
    |
    |   0% → -200%
    |
    | The current page underneath is revealed.
    |
    */

    timeline.to(
      screenTwo,
      {
        yPercent: -200,
        duration: this.RELOAD_WIPE_DURATION,
        ease: "power3.out",
      },
      ">",
    );

    return {
      contentReady,
      finished,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Destroy
  |--------------------------------------------------------------------------
  */

  destroy(): void {
    gsap.killTweensOf([this.layer.getScreenOne(), this.layer.getScreenTwo()]);
  }
}

export default PageTransition;
