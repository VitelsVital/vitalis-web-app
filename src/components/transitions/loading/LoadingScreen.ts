import gsap from "gsap";

import TransitionLayer from "../TransitionLayer";

/**
 * |--------------------------------------------------------------------------
 * | Loading Screen
 * |--------------------------------------------------------------------------
 *
 * Responsibilities:
 *
 * - Homepage:
 *   - Display the loading screen
 *   - Animate the top progress line
 *   - Reveal VITALIS MULWA from left → right
 *   - Animate the percentage counter
 *   - Resolve play() exactly at 100%
 *
 * - Non-homepage:
 *   - Display only a blank dark cover
 *   - No progress line
 *   - No name
 *   - No counter
 *
 * - Shared:
 *   - Start the shared curtains during exit
 *   - Remove the cover once the curtain covers it
 *
 * LoadingScreen does NOT create transition screens.
 *
 * TransitionLayer owns:
 *
 * - Screen One
 * - Screen Two
 *
 * |--------------------------------------------------------------------------
 */

export default class LoadingScreen {
  /**
   * |--------------------------------------------------------------------------
   * | Loading Timing
   * |--------------------------------------------------------------------------
   */

  private readonly LOADING_DURATION = 2.4;

  /**
   * |--------------------------------------------------------------------------
   * | Curtain Timing
   * |--------------------------------------------------------------------------
   */

  private readonly SCREEN_TWO_DURATION = 1.2;
  private readonly SCREEN_ONE_DURATION = 1.08;

  /**
   * |--------------------------------------------------------------------------
   * | Screen One Delay
   * |--------------------------------------------------------------------------
   */

  private readonly SCREEN_ONE_DELAY = 0.15;

  /**
   * |--------------------------------------------------------------------------
   * | Mode
   * |--------------------------------------------------------------------------
   */

  private readonly isHomepage: boolean;

  /**
   * |--------------------------------------------------------------------------
   * | Elements
   * |--------------------------------------------------------------------------
   */

  private readonly container: HTMLDivElement;

  private readonly progressLine: HTMLDivElement | null;
  private readonly loaderContent: HTMLDivElement | null;
  private readonly name: HTMLDivElement | null;
  private readonly nameBright: HTMLDivElement | null;
  private readonly counter: HTMLDivElement | null;

  /**
   * |--------------------------------------------------------------------------
   * | Shared Transition Layer
   * |--------------------------------------------------------------------------
   */

  private readonly transitionLayer: TransitionLayer;

  /**
   * |--------------------------------------------------------------------------
   * | Constructor
   * |--------------------------------------------------------------------------
   */

  constructor(transitionLayer: TransitionLayer, isHomepage: boolean) {
    /**
     * |--------------------------------------------------------------------------
     * | Store Dependencies
     * |--------------------------------------------------------------------------
     */

    this.transitionLayer = transitionLayer;
    this.isHomepage = isHomepage;

    /**
     * |--------------------------------------------------------------------------
     * | Container
     * |--------------------------------------------------------------------------
     *
     * The container always exists.
     *
     * Homepage:
     *   Contains the actual loader.
     *
     * Non-homepage:
     *   Contains NOTHING except the dark cover.
     *
     * This is intentional. We do not create hidden loader elements on
     * non-homepage pages because they could still contribute to a flash
     * during the first paint.
     */

    this.container = document.createElement("div");
    this.container.className = "loading-screen";

    /**
     * |--------------------------------------------------------------------------
     * | Non-homepage
     * |--------------------------------------------------------------------------
     *
     * Stop here.
     *
     * The CSS for .loading-screen supplies:
     *
     * background: var(--color-dark);
     *
     * No loader line.
     * No name.
     * No counter.
     */

    if (!this.isHomepage) {
      this.progressLine = null;
      this.loaderContent = null;
      this.name = null;
      this.nameBright = null;
      this.counter = null;

      return;
    }

    /**
     * |--------------------------------------------------------------------------
     * | Homepage Loader
     * |--------------------------------------------------------------------------
     */

    /**
     * | Progress Line
     * |--------------------------------------------------------------------------
     */

    this.progressLine = document.createElement("div");
    this.progressLine.className = "loading-screen-line";

    /**
     * | Loader Content
     * |--------------------------------------------------------------------------
     */

    this.loaderContent = document.createElement("div");
    this.loaderContent.className = "loader-content";

    /**
     * | Name
     * |--------------------------------------------------------------------------
     */

    this.name = document.createElement("div");
    this.name.className = "loading-screen-name";
    this.name.textContent = "VITALIS MULWA";

    /**
     * | Bright Name
     * |--------------------------------------------------------------------------
     */

    this.nameBright = document.createElement("div");
    this.nameBright.className = "loading-screen-name-bright";
    this.nameBright.textContent = "VITALIS MULWA";

    this.name.appendChild(this.nameBright);

    /**
     * | Counter
     * |--------------------------------------------------------------------------
     */

    this.counter = document.createElement("div");
    this.counter.className = "loading-screen-counter";
    this.counter.textContent = "0";

    /**
     * | Assemble Loader Content
     * |--------------------------------------------------------------------------
     */

    this.loaderContent.append(this.name, this.counter);

    /**
     * | Assemble Loading Screen
     * |--------------------------------------------------------------------------
     */

    this.container.append(this.progressLine, this.loaderContent);
  }

  /**
   * |--------------------------------------------------------------------------
   * | Get Element
   * |--------------------------------------------------------------------------
   */

  getElement(): HTMLDivElement {
    return this.container;
  }

  /**
   * |--------------------------------------------------------------------------
   * | Render
   * |--------------------------------------------------------------------------
   */

  render(): HTMLDivElement {
    return this.container;
  }

  /**
   * |--------------------------------------------------------------------------
   * | PLAY
   * |--------------------------------------------------------------------------
   *
   * Homepage:
   *
   *   0 → 100
   *
   * Non-homepage:
   *
   *   Nothing to animate.
   *   Resolve immediately.
   *
   * The dark cover remains visible until exit() is called.
   */

  play(): Promise<void> {
    /**
     * |--------------------------------------------------------------------------
     * | Non-homepage
     * |--------------------------------------------------------------------------
     */

    if (!this.isHomepage) {
      gsap.set(this.container, {
        autoAlpha: 1,
      });

      return Promise.resolve();
    }

    /**
     * |--------------------------------------------------------------------------
     * | Homepage Loader
     * |--------------------------------------------------------------------------
     */

    return new Promise((resolve) => {
      /**
       * |--------------------------------------------------------------------------
       * | Initial Visibility
       * |--------------------------------------------------------------------------
       */

      gsap.set(this.container, {
        autoAlpha: 1,
      });

      /**
       * |--------------------------------------------------------------------------
       * | Reset Progress Line
       * |--------------------------------------------------------------------------
       */

      gsap.set(this.progressLine!, {
        scaleX: 0,
        transformOrigin: "left center",
      });

      /**
       * |--------------------------------------------------------------------------
       * | Reset Name Reveal
       * |--------------------------------------------------------------------------
       */

      gsap.set(this.nameBright!, {
        clipPath: "inset(0 100% 0 0)",
      });

      /**
       * |--------------------------------------------------------------------------
       * | Reset Content
       * |--------------------------------------------------------------------------
       */

      gsap.set([this.name!, this.counter!], {
        yPercent: 0,
        y: 0,
        opacity: 1,
      });

      /**
       * |--------------------------------------------------------------------------
       * | Shared Progress
       * |--------------------------------------------------------------------------
       */

      const progress = {
        value: 0,
      };

      /**
       * |--------------------------------------------------------------------------
       * | Progress Animation
       * |--------------------------------------------------------------------------
       */

      gsap.to(progress, {
        value: 100,
        duration: this.LOADING_DURATION,
        ease: "power3.out",

        /**
         * |--------------------------------------------------------------------------
         * | Update
         * |--------------------------------------------------------------------------
         */

        onUpdate: () => {
          const value = Math.round(progress.value);

          /**
           * | Counter
           * |--------------------------------------------------------------------------
           */

          this.counter!.textContent = `${value}`;

          /**
           * | Progress Line
           * |--------------------------------------------------------------------------
           */

          gsap.set(this.progressLine!, {
            scaleX: progress.value / 100,
          });

          /**
           * | Name Reveal
           * |--------------------------------------------------------------------------
           */

          gsap.set(this.nameBright!, {
            clipPath: `inset(0 ${100 - progress.value}% 0 0)`,
          });
        },

        /**
         * |--------------------------------------------------------------------------
         * | Complete
         * |--------------------------------------------------------------------------
         */

        onComplete: () => {
          /**
           * | Guarantee Final State
           * |--------------------------------------------------------------------------
           */

          this.counter!.textContent = "100";

          gsap.set(this.progressLine!, {
            scaleX: 1,
          });

          gsap.set(this.nameBright!, {
            clipPath: "inset(0 0% 0 0)",
          });

          /**
           * |--------------------------------------------------------------------------
           * | Loader Remains Visible
           * |--------------------------------------------------------------------------
           *
           * The caller decides when exit() begins.
           */

          resolve();
        },
      });
    });
  }

  /**
   * |--------------------------------------------------------------------------
   * | EXIT
   * |--------------------------------------------------------------------------
   *
   * Visual sequence:
   *
   * Cover at initial state
   *       ↓
   * Curtains appear
   *       ↓
   * Curtains start at +5%
   *       ↓
   * Curtains move upward
   *       ↓
   * Screen Two reaches -100%
   *       ↓
   * Cover is removed
   *       ↓
   * Curtains continue upward
   *       ↓
   * Curtains reach -200%
   *       ↓
   * TransitionLayer resets to +5%
   *       ↓
   * TransitionLayer hides
   *
   * This is identical for homepage and non-homepage.
   *
   */

  exit(): Promise<void> {
    return new Promise((resolve) => {
      /**
       * |--------------------------------------------------------------------------
       * | Get Shared Screens
       * |--------------------------------------------------------------------------
       */

      const screenOne = this.transitionLayer.getScreenOne();
      const screenTwo = this.transitionLayer.getScreenTwo();

      /**
       * |--------------------------------------------------------------------------
       * | Prepare Transition Layer
       * |--------------------------------------------------------------------------
       */

      this.transitionLayer.reset();

      /**
       * |--------------------------------------------------------------------------
       * | Show Transition Layer
       * |--------------------------------------------------------------------------
       */

      this.transitionLayer.show();

      /**
       * |--------------------------------------------------------------------------
       * | Layering
       * |--------------------------------------------------------------------------
       */

      gsap.set(screenOne, {
        zIndex: 1,
      });

      gsap.set(screenTwo, {
        zIndex: 2,
      });

      /**
       * |--------------------------------------------------------------------------
       * | Cover Removal State
       * |--------------------------------------------------------------------------
       */

      let coverRemoved = false;

      /**
       * |--------------------------------------------------------------------------
       * | Exit Timeline
       * |--------------------------------------------------------------------------
       */

      const timeline = gsap.timeline({
        onComplete: () => {
          /**
           * |--------------------------------------------------------------------------
           * | Curtains Have Finished
           * |--------------------------------------------------------------------------
           */

          this.transitionLayer.reset();

          /**
           * |--------------------------------------------------------------------------
           * | Hide Shared Layer
           * |--------------------------------------------------------------------------
           */

          this.transitionLayer.hide();

          /**
           * |--------------------------------------------------------------------------
           * | Resolve
           * |--------------------------------------------------------------------------
           */

          resolve();
        },
      });

      /**
       * |--------------------------------------------------------------------------
       * | SCREEN TWO
       * |--------------------------------------------------------------------------
       *
       * Leading curtain.
       *
       * 5% → -200%
       *
       */

      timeline.to(
        screenTwo,
        {
          yPercent: -200,
          duration: this.SCREEN_TWO_DURATION,
          ease: "power3.out",

          /**
           * |--------------------------------------------------------------------------
           * | Remove Cover When Covered
           * |--------------------------------------------------------------------------
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

      /**
       * |--------------------------------------------------------------------------
       * | SCREEN ONE
       * |--------------------------------------------------------------------------
       *
       * Follows Screen Two by 150ms.
       *
       * 5% → -200%
       *
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

  /**
   * |--------------------------------------------------------------------------
   * | Hide
   * |--------------------------------------------------------------------------
   */

  hide(): void {
    gsap.set(this.container, {
      autoAlpha: 0,
    });
  }

  /**
   * |--------------------------------------------------------------------------
   * | Remove
   * |--------------------------------------------------------------------------
   */

  remove(): void {
    gsap.killTweensOf([
      this.container,
      this.progressLine,
      this.loaderContent,
      this.name,
      this.nameBright,
      this.counter,
    ]);

    this.container.remove();
  }

  /**
   * |--------------------------------------------------------------------------
   * | Destroy
   * |--------------------------------------------------------------------------
   */

  destroy(): void {
    gsap.killTweensOf([
      this.container,
      this.progressLine,
      this.loaderContent,
      this.name,
      this.nameBright,
      this.counter,
    ]);

    this.container.remove();
  }
}
