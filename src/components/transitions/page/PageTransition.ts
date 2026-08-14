import gsap from "gsap";

class PageTransition {
  private container: HTMLDivElement;

  private screenOne: HTMLDivElement;

  private screenTwo: HTMLDivElement;

  /*
  |--------------------------------------------------------------------------
  | Content paint timing
  |--------------------------------------------------------------------------
  |
  | Time in milliseconds after the transition starts
  | at which the new page may be displayed.
  |
  */

  private readonly CONTENT_TIME = 400;

  constructor() {
    this.container = document.createElement("div");

    this.container.className = "transition-container";

    /*
    |--------------------------------------------------------------------------
    | Screen One
    |--------------------------------------------------------------------------
    */

    this.screenOne = document.createElement("div");

    this.screenOne.className = "transition-screen-one";

    this.screenOne.innerHTML = `
      <div class="fixed-background primary">
        <div class="texture"></div>
      </div>
    `;

    /*
    |--------------------------------------------------------------------------
    | Screen Two
    |--------------------------------------------------------------------------
    */

    this.screenTwo = document.createElement("div");

    this.screenTwo.className = "transition-screen-two";

    this.screenTwo.innerHTML = `
      <div class="fixed-background secondary">
        <div class="texture"></div>
      </div>
    `;

    /*
    |--------------------------------------------------------------------------
    | DOM
    |--------------------------------------------------------------------------
    */

    this.container.appendChild(this.screenOne);

    this.container.appendChild(this.screenTwo);

    document.body.appendChild(this.container);

    /*
    |--------------------------------------------------------------------------
    | Initial state
    |--------------------------------------------------------------------------
    */

    this.reset();
  }

  /*
  |--------------------------------------------------------------------------
  | Reset
  |--------------------------------------------------------------------------
  |
  | Returns the transition to its completely
  | hidden idle state.
  |
  | IMPORTANT:
  |
  | The container is hidden FIRST.
  | The screens are then immediately returned
  | to their starting position while invisible.
  |
  */

  reset(): void {
    /*
    |--------------------------------------------------------------------------
    | Kill running screen animations
    |--------------------------------------------------------------------------
    */

    gsap.killTweensOf([this.screenOne, this.screenTwo]);

    /*
    |--------------------------------------------------------------------------
    | Hide container FIRST
    |--------------------------------------------------------------------------
    */

    gsap.set(this.container, {
      display: "none",
    });

    /*
    |--------------------------------------------------------------------------
    | Reset screens
    |--------------------------------------------------------------------------
    */

    gsap.set(this.screenOne, {
      yPercent: 5,
    });

    gsap.set(this.screenTwo, {
      yPercent: 5,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Play
  |--------------------------------------------------------------------------
  |
  | Starts a fresh transition from the reset state.
  |
  */

  play(): {
    contentReady: Promise<void>;
    finished: Promise<void>;
  } {
    /*
    |--------------------------------------------------------------------------
    | Make sure any previous transition is stopped
    |--------------------------------------------------------------------------
    */

    gsap.killTweensOf([this.screenOne, this.screenTwo]);

    /*
    |--------------------------------------------------------------------------
    | Show container
    |--------------------------------------------------------------------------
    */

    gsap.set(this.container, {
      display: "block",
    });

    /*
    |--------------------------------------------------------------------------
    | Explicit starting positions
    |--------------------------------------------------------------------------
    */

    gsap.set(this.screenOne, {
      yPercent: 5,
    });

    gsap.set(this.screenTwo, {
      yPercent: 5,
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
    | Content release
    |--------------------------------------------------------------------------
    |
    | The new Barba container is allowed to appear
    | at CONTENT_TIME.
    |
    */

    gsap.delayedCall(this.CONTENT_TIME / 1000, () => {
      contentResolve?.();
    });

    /*
    |--------------------------------------------------------------------------
    | Transition timeline
    |--------------------------------------------------------------------------
    */

    const timeline = gsap.timeline({
      onComplete: () => {
        /*
          |--------------------------------------------------------------------------
          | Transition animation is completely finished.
          |--------------------------------------------------------------------------
          |
          | FIRST:
          | Hide the transition container.
          |
          | SECOND:
          | Immediately reset both screens back to
          | their starting position.
          |
          | Because the container is already hidden,
          | the reset can never visually flash.
          |
          */

        gsap.set(this.container, {
          display: "none",
        });

        gsap.set(this.screenOne, {
          yPercent: 5,
        });

        gsap.set(this.screenTwo, {
          yPercent: 5,
        });

        /*
          |--------------------------------------------------------------------------
          | Tell Barba that the visual transition
          | has completely finished.
          |--------------------------------------------------------------------------
          */

        finishedResolve?.();
      },
    });

    /*
    |--------------------------------------------------------------------------
    | Screen Two
    |--------------------------------------------------------------------------
    |
    | Screen Two starts first.
    |
    */

    timeline.to(
      this.screenTwo,
      {
        yPercent: -200,
        duration: 1.0,
        ease: "power3.Out",
      },
      0,
    );

    /*
    |--------------------------------------------------------------------------
    | Screen One
    |--------------------------------------------------------------------------
    |
    | Screen One follows 150ms later.
    |
    */

    timeline.to(
      this.screenOne,
      {
        yPercent: -200,
        duration: 0.9,
        ease: "power3.Out",
      },
      0.15,
    );

    /*
    |--------------------------------------------------------------------------
    | Return transition state
    |--------------------------------------------------------------------------
    */

    return {
      contentReady,
      finished,
    };
  }
}

export default PageTransition;
