import gsap from "gsap";

import TransitionLayer from "../TransitionLayer";

class RefreshCover {
  /*
  |--------------------------------------------------------------------------
  | Timing
  |--------------------------------------------------------------------------
  |
  | These match the LoadingScreen curtain choreography.
  |
  */

  private readonly SCREEN_TWO_DURATION = 1.2;

  private readonly SCREEN_ONE_DURATION = 1.08;

  private readonly SCREEN_ONE_DELAY = 0.15;

  /*
  |--------------------------------------------------------------------------
  | Element
  |--------------------------------------------------------------------------
  */

  private readonly element: HTMLDivElement;

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
    | Element
    |--------------------------------------------------------------------------
    */

    this.element = document.createElement("div");

    this.element.className = "refresh-cover";

    /*
    |--------------------------------------------------------------------------
    | Content
    |--------------------------------------------------------------------------
    */

    this.element.innerHTML = `
      <div class="refresh-cover-background">
        <div class="texture"></div>
      </div>
    `;

    /*
    |--------------------------------------------------------------------------
    | Initial State
    |--------------------------------------------------------------------------
    |
    | The RefreshCover must immediately own the viewport.
    |
    */

    this.show();
  }

  /*
  |--------------------------------------------------------------------------
  | Get Element
  |--------------------------------------------------------------------------
  */

  getElement(): HTMLDivElement {
    return this.element;
  }

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  render(): HTMLDivElement {
    return this.element;
  }

  /*
  |--------------------------------------------------------------------------
  | Show
  |--------------------------------------------------------------------------
  */

  show(): void {
    gsap.set(this.element, {
      display: "block",
      autoAlpha: 1,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Hide
  |--------------------------------------------------------------------------
  */

  hide(): void {
    gsap.set(this.element, {
      display: "none",
      autoAlpha: 0,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | PLAY
  |--------------------------------------------------------------------------
  |
  | The RefreshCover is already visible.
  |
  | play() simply guarantees that state.
  |
  */

  play(): void {
    /*
    |--------------------------------------------------------------------------
    | Make Sure Refresh Cover Owns Viewport
    |--------------------------------------------------------------------------
    */

    this.show();
  }

  /*
  |--------------------------------------------------------------------------
  | EXIT
  |--------------------------------------------------------------------------
  |
  | This follows the exact curtain behavior used by
  | LoadingScreen.exit().
  |
  | Visual sequence:
  |
  | RefreshCover
  |       ↓
  | TransitionLayer appears
  |       ↓
  | Screen Two moves upward
  |       ↓
  | Screen Two covers RefreshCover
  |       ↓
  | RefreshCover is removed
  |       ↓
  | Screen One follows
  |       ↓
  | TransitionLayer finishes
  |       ↓
  | Current page is revealed
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
      | Both screens begin at +5%, exactly like LoadingScreen.
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
      | Refresh Cover Removal State
      |--------------------------------------------------------------------------
      */

      let coverRemoved = false;

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
      | +5% → -200%
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
          | Remove Refresh Cover When Covered
          |--------------------------------------------------------------------------
          |
          | Once Screen Two reaches approximately -100%,
          | it has physically covered the RefreshCover.
          |
          */

          onUpdate: () => {
            const yPercent = Number(gsap.getProperty(screenTwo, "yPercent"));

            if (!coverRemoved && yPercent <= -100) {
              coverRemoved = true;

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
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Remove
  |--------------------------------------------------------------------------
  |
  | Removes ONLY the RefreshCover.
  |
  | The global loading-container remains.
  |
  | The shared TransitionLayer remains mounted.
  |
  */

  remove(): void {
    gsap.killTweensOf(this.element);

    this.element.remove();
  }

  /*
  |--------------------------------------------------------------------------
  | Destroy
  |--------------------------------------------------------------------------
  */

  destroy(): void {
    gsap.killTweensOf(this.element);

    this.element.remove();
  }
}

export default RefreshCover;
