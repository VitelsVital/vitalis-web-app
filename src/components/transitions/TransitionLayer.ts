import gsap from "gsap";

class TransitionLayer {
  /*
  |--------------------------------------------------------------------------
  | Container
  |--------------------------------------------------------------------------
  |
  | This is the shared visual layer containing:
  |
  | - Screen One
  | - Screen Two
  |
  | LoadingScreen, PageTransition and MenuTransition
  | all use these same screens.
  |
  */

  private readonly container: HTMLDivElement;

  /*
  |--------------------------------------------------------------------------
  | Shared Screens
  |--------------------------------------------------------------------------
  */

  private readonly screenOne: HTMLDivElement;

  private readonly screenTwo: HTMLDivElement;

  /*
  |--------------------------------------------------------------------------
  | Constructor
  |--------------------------------------------------------------------------
  */

  constructor() {
    /*
    |--------------------------------------------------------------------------
    | Container
    |--------------------------------------------------------------------------
    */

    this.container = document.createElement("div");

    this.container.className = "transition-layer";

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

    this.container.append(this.screenOne, this.screenTwo);

    /*
    |--------------------------------------------------------------------------
    | Initial State
    |--------------------------------------------------------------------------
    */

    this.reset();
  }

  /*
  |--------------------------------------------------------------------------
  | Get Element
  |--------------------------------------------------------------------------
  |
  | TransitionManager mounts the shared layer inside
  | .loading-container.
  |
  */

  getElement(): HTMLDivElement {
    return this.container;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Screen One
  |--------------------------------------------------------------------------
  */

  getScreenOne(): HTMLDivElement {
    return this.screenOne;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Screen Two
  |--------------------------------------------------------------------------
  */

  getScreenTwo(): HTMLDivElement {
    return this.screenTwo;
  }

  /*
  |--------------------------------------------------------------------------
  | Show
  |--------------------------------------------------------------------------
  |
  | Makes the shared transition layer visible.
  |
  */

  show(): void {
    gsap.set(this.container, {
      display: "block",
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Hide
  |--------------------------------------------------------------------------
  |
  | Hides the shared transition layer without destroying it.
  |
  */

  hide(): void {
    gsap.set(this.container, {
      display: "none",
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Reset
  |--------------------------------------------------------------------------
  |
  | Returns both screens to their starting position.
  |
  | IMPORTANT:
  |
  | The screens start below the viewport.
  |
  */

  reset(): void {
    /*
    |--------------------------------------------------------------------------
    | Kill Existing Animations
    |--------------------------------------------------------------------------
    */

    gsap.killTweensOf([this.screenOne, this.screenTwo]);

    /*
    |--------------------------------------------------------------------------
    | Container
    |--------------------------------------------------------------------------
    */

    gsap.set(this.container, {
      display: "none",
    });

    /*
    |--------------------------------------------------------------------------
    | Screen One
    |--------------------------------------------------------------------------
    */

    gsap.set(this.screenOne, {
      yPercent: 5,
      zIndex: 1,
    });

    /*
    |--------------------------------------------------------------------------
    | Screen Two
    |--------------------------------------------------------------------------
    */

    gsap.set(this.screenTwo, {
      yPercent: 5,
      zIndex: 2,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Reset Screens Only
  |--------------------------------------------------------------------------
  |
  | Useful when a transition needs to remain visible
  | while its screens are repositioned.
  |
  */

  resetScreens(): void {
    gsap.killTweensOf([this.screenOne, this.screenTwo]);

    gsap.set(this.screenOne, {
      yPercent: 5,
    });

    gsap.set(this.screenTwo, {
      yPercent: 5,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Destroy
  |--------------------------------------------------------------------------
  |
  | TransitionLayer owns the shared screens, so it is responsible
  | for destroying them.
  |
  */

  destroy(): void {
    gsap.killTweensOf([this.container, this.screenOne, this.screenTwo]);

    this.container.remove();
  }
}

export default TransitionLayer;
