import gsap from "gsap";

import TransitionLayer from "../TransitionLayer";

/*
|--------------------------------------------------------------------------
| Loading Screen
|--------------------------------------------------------------------------
|
| Responsibilities:
|
| - Display the loading screen
| - Animate the top progress line
| - Reveal VITALIS MULWA from left → right
| - Animate the percentage counter
| - Resolve play() exactly at 100%
| - Keep the loader visible at 100%
| - Start the shared curtains during exit
| - Remove the loader once the curtain covers it
|
| LoadingScreen does NOT create transition screens.
|
| TransitionLayer owns:
|
| - Screen One
| - Screen Two
|
*/

export default class LoadingScreen {
  /*
  |--------------------------------------------------------------------------
  | Loading Timing
  |--------------------------------------------------------------------------
  */

  private readonly LOADING_DURATION = 2.4;

  /*
  |--------------------------------------------------------------------------
  | Curtain Timing
  |--------------------------------------------------------------------------
  |
  | The curtains start at yPercent: 5
  | and travel upward to -200.
  |
  */

  private readonly SCREEN_TWO_DURATION = 1.2;

  private readonly SCREEN_ONE_DURATION = 1.08;

  /*
  |--------------------------------------------------------------------------
  | Screen One Delay
  |--------------------------------------------------------------------------
  |
  | Screen Two leads.
  | Screen One follows 150ms later.
  |
  */

  private readonly SCREEN_ONE_DELAY = 0.15;

  /*
  |--------------------------------------------------------------------------
  | Elements
  |--------------------------------------------------------------------------
  */

  private readonly container: HTMLDivElement;

  private readonly progressLine: HTMLDivElement;

  private readonly loaderContent: HTMLDivElement;

  private readonly name: HTMLDivElement;

  private readonly nameBright: HTMLDivElement;

  private readonly counter: HTMLDivElement;

  /*
  |--------------------------------------------------------------------------
  | Shared Transition Layer
  |--------------------------------------------------------------------------
  */

  private readonly transitionLayer: TransitionLayer;

  /*
  |--------------------------------------------------------------------------
  | Constructor
  |--------------------------------------------------------------------------
  */

  constructor(transitionLayer: TransitionLayer) {
    /*
    |--------------------------------------------------------------------------
    | Store Shared Transition Layer
    |--------------------------------------------------------------------------
    */

    this.transitionLayer = transitionLayer;

    /*
    |--------------------------------------------------------------------------
    | Container
    |--------------------------------------------------------------------------
    */

    this.container = document.createElement("div");

    this.container.className = "loading-screen";

    /*
    |--------------------------------------------------------------------------
    | Progress Line
    |--------------------------------------------------------------------------
    */

    this.progressLine = document.createElement("div");

    this.progressLine.className = "loading-screen-line";

    /*
    |--------------------------------------------------------------------------
    | Loader Content
    |--------------------------------------------------------------------------
    */

    this.loaderContent = document.createElement("div");

    this.loaderContent.className = "loader-content";

    /*
    |--------------------------------------------------------------------------
    | Name
    |--------------------------------------------------------------------------
    */

    this.name = document.createElement("div");

    this.name.className = "loading-screen-name";

    this.name.textContent = "VITALIS MULWA";

    /*
    |--------------------------------------------------------------------------
    | Bright Name
    |--------------------------------------------------------------------------
    */

    this.nameBright = document.createElement("div");

    this.nameBright.className = "loading-screen-name-bright";

    this.nameBright.textContent = "VITALIS MULWA";

    this.name.appendChild(this.nameBright);

    /*
    |--------------------------------------------------------------------------
    | Counter
    |--------------------------------------------------------------------------
    */

    this.counter = document.createElement("div");

    this.counter.className = "loading-screen-counter";

    this.counter.textContent = "0";

    /*
    |--------------------------------------------------------------------------
    | Assemble Loader Content
    |--------------------------------------------------------------------------
    */

    this.loaderContent.append(this.name, this.counter);

    /*
    |--------------------------------------------------------------------------
    | Assemble Loading Screen
    |--------------------------------------------------------------------------
    */

    this.container.append(this.progressLine, this.loaderContent);
  }

  /*
  |--------------------------------------------------------------------------
  | Get Element
  |--------------------------------------------------------------------------
  */

  getElement(): HTMLDivElement {
    return this.container;
  }

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  render(): HTMLDivElement {
    return this.container;
  }

  /*
  |--------------------------------------------------------------------------
  | PLAY
  |--------------------------------------------------------------------------
  |
  | The loader animates from 0 → 100.
  |
  | IMPORTANT:
  |
  | When 100% is reached:
  |
  | - The loader stays visible.
  | - The loader is NOT removed.
  | - The curtains do NOT start here.
  |
  | The caller decides when exit() begins.
  |
  */

  play(): Promise<void> {
    return new Promise((resolve) => {
      /*
      |--------------------------------------------------------------------------
      | Initial Visibility
      |--------------------------------------------------------------------------
      */

      gsap.set(this.container, {
        autoAlpha: 1,
      });

      /*
      |--------------------------------------------------------------------------
      | Reset Progress Line
      |--------------------------------------------------------------------------
      */

      gsap.set(this.progressLine, {
        scaleX: 0,
        transformOrigin: "left center",
      });

      /*
      |--------------------------------------------------------------------------
      | Reset Name Reveal
      |--------------------------------------------------------------------------
      */

      gsap.set(this.nameBright, {
        clipPath: "inset(0 100% 0 0)",
      });

      /*
      |--------------------------------------------------------------------------
      | Reset Content
      |--------------------------------------------------------------------------
      */

      gsap.set([this.name, this.counter], {
        yPercent: 0,
        y: 0,
        opacity: 1,
      });

      /*
      |--------------------------------------------------------------------------
      | Shared Progress
      |--------------------------------------------------------------------------
      */

      const progress = {
        value: 0,
      };

      /*
      |--------------------------------------------------------------------------
      | Progress Animation
      |--------------------------------------------------------------------------
      */

      gsap.to(progress, {
        value: 100,

        duration: this.LOADING_DURATION,

        ease: "power3.out",

        /*
        |--------------------------------------------------------------------------
        | Update
        |--------------------------------------------------------------------------
        */

        onUpdate: () => {
          const value = Math.round(progress.value);

          /*
          |--------------------------------------------------------------------------
          | Counter
          |--------------------------------------------------------------------------
          */

          this.counter.textContent = `${value}`;

          /*
          |--------------------------------------------------------------------------
          | Progress Line
          |--------------------------------------------------------------------------
          */

          gsap.set(this.progressLine, {
            scaleX: progress.value / 100,
          });

          /*
          |--------------------------------------------------------------------------
          | Name Reveal
          |--------------------------------------------------------------------------
          */

          gsap.set(this.nameBright, {
            clipPath: `inset(0 ${100 - progress.value}% 0 0)`,
          });
        },

        /*
        |--------------------------------------------------------------------------
        | Complete
        |--------------------------------------------------------------------------
        */

        onComplete: () => {
          /*
          |--------------------------------------------------------------------------
          | Guarantee Final State
          |--------------------------------------------------------------------------
          */

          this.counter.textContent = "100";

          gsap.set(this.progressLine, {
            scaleX: 1,
          });

          gsap.set(this.nameBright, {
            clipPath: "inset(0 0% 0 0)",
          });

          /*
          |--------------------------------------------------------------------------
          | IMPORTANT
          |--------------------------------------------------------------------------
          |
          | The loader remains visible here.
          |
          | The page can already exist underneath it.
          |
          */

          resolve();
        },
      });
    });
  }

  /*
  |--------------------------------------------------------------------------
  | EXIT
  |--------------------------------------------------------------------------
  |
  | Visual sequence:
  |
  | Loader at 100%
  |       ↓
  | Curtains appear
  |       ↓
  | Curtains start at +5%
  |       ↓
  | Curtains move upward
  |       ↓
  | Screen Two reaches 0%
  |       ↓
  | Loader is covered and removed
  |       ↓
  | Curtains continue upward
  |       ↓
  | Curtains reach -200%
  |       ↓
  | TransitionLayer resets to +5%
  |       ↓
  | TransitionLayer hides
  |
  */

  exit(): Promise<void> {
    return new Promise((resolve) => {
      /*
      |--------------------------------------------------------------------------
      | Get Shared Screens
      |--------------------------------------------------------------------------
      */

      const screenOne = this.transitionLayer.getScreenOne();

      const screenTwo = this.transitionLayer.getScreenTwo();

      /*
      |--------------------------------------------------------------------------
      | Prepare Transition Layer
      |--------------------------------------------------------------------------
      |
      | reset() places both screens at yPercent: 5
      | and hides the layer.
      |
      */

      this.transitionLayer.reset();

      /*
      |--------------------------------------------------------------------------
      | Show Transition Layer
      |--------------------------------------------------------------------------
      */

      this.transitionLayer.show();

      /*
      |--------------------------------------------------------------------------
      | Layering
      |--------------------------------------------------------------------------
      |
      | Screen Two leads.
      |
      */

      gsap.set(screenOne, {
        zIndex: 1,
      });

      gsap.set(screenTwo, {
        zIndex: 2,
      });

      /*
      |--------------------------------------------------------------------------
      | Loader Removal State
      |--------------------------------------------------------------------------
      */

      let loaderRemoved = false;

      /*
      |--------------------------------------------------------------------------
      | Exit Timeline
      |--------------------------------------------------------------------------
      */

      const timeline = gsap.timeline({
        onComplete: () => {
          /*
          |--------------------------------------------------------------------------
          | Curtains Have Finished
          |--------------------------------------------------------------------------
          */

          this.transitionLayer.reset();

          /*
          |--------------------------------------------------------------------------
          | Hide Shared Layer
          |--------------------------------------------------------------------------
          |
          | The TransitionLayer remains mounted and ready
          | for the next transition.
          |
          */

          this.transitionLayer.hide();

          /*
          |--------------------------------------------------------------------------
          | Resolve
          |--------------------------------------------------------------------------
          */

          resolve();
        },
      });

      /*
      |--------------------------------------------------------------------------
      | SCREEN TWO
      |--------------------------------------------------------------------------
      |
      | Leading curtain.
      |
      | 5% → -200%
      |
      */

      timeline.to(
        screenTwo,
        {
          yPercent: -200,

          duration: this.SCREEN_TWO_DURATION,

          ease: "power3.out",

          /*
          |--------------------------------------------------------------------------
          | Remove Loader When Covered
          |--------------------------------------------------------------------------
          |
          | At approximately 0%, Screen Two has reached the
          | loader's visual position and covers it.
          |
          */

          onUpdate: () => {
            const yPercent = Number(gsap.getProperty(screenTwo, "yPercent"));

            if (!loaderRemoved && yPercent <= -100) {
              loaderRemoved = true;

              this.remove();
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
      | Follows Screen Two by 150ms.
      |
      | 5% → -200%
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
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Hide
  |--------------------------------------------------------------------------
  */

  hide(): void {
    gsap.set(this.container, {
      autoAlpha: 0,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Remove
  |--------------------------------------------------------------------------
  |
  | Removes ONLY the loading screen.
  |
  | The global loading-container remains.
  |
  | The shared TransitionLayer remains mounted.
  |
  */

  remove(): void {
    gsap.killTweensOf([
      this.container,
      this.progressLine,
      this.name,
      this.nameBright,
      this.counter,
    ]);

    this.container.remove();
  }

  /*
  |--------------------------------------------------------------------------
  | Destroy
  |--------------------------------------------------------------------------
  */

  destroy(): void {
    gsap.killTweensOf([
      this.container,
      this.progressLine,
      this.name,
      this.nameBright,
      this.counter,
    ]);

    this.container.remove();
  }
}
