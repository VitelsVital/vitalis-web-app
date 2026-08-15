import gsap from "gsap";

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
| - Briefly lift the name and counter when transition starts
| - Remove itself only after PageTransition has taken over
|
*/

export default class LoadingScreen {
  private readonly container: HTMLDivElement;

  private readonly progressLine: HTMLDivElement;

  private readonly loaderContent: HTMLDivElement;

  private readonly name: HTMLDivElement;

  private readonly nameBright: HTMLDivElement;

  private readonly counter: HTMLDivElement;

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
  | Render
  |--------------------------------------------------------------------------
  */

  render(): HTMLDivElement {
    return this.container;
  }

  /*
  |--------------------------------------------------------------------------
  | Play
  |--------------------------------------------------------------------------
  |
  | Resolves EXACTLY when progress reaches 100%.
  |
  | It does not hide or remove the loader.
  |
  */

  play(): Promise<void> {
    return new Promise((resolve) => {
      /*
      |--------------------------------------------------------------------------
      | Initial State
      |--------------------------------------------------------------------------
      */

      gsap.set(this.container, {
        autoAlpha: 1,
      });

      /*
      |--------------------------------------------------------------------------
      | Progress Line
      |--------------------------------------------------------------------------
      */

      gsap.set(this.progressLine, {
        scaleX: 0,
        transformOrigin: "left center",
      });

      /*
      |--------------------------------------------------------------------------
      | Name Reveal
      |--------------------------------------------------------------------------
      */

      gsap.set(this.nameBright, {
        clipPath: "inset(0 100% 0 0)",
      });

      /*
      |--------------------------------------------------------------------------
      | Reset Handoff Position
      |--------------------------------------------------------------------------
      |
      | Important if LoadingScreen is reused.
      |
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

        duration: 2.4,

        ease: "power3.Out",

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
          | Top Line
          |--------------------------------------------------------------------------
          */

          gsap.set(this.progressLine, {
            scaleX: progress.value / 100,
          });

          /*
          |--------------------------------------------------------------------------
          | Name
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
          | Resolve
          |--------------------------------------------------------------------------
          */

          resolve();
        },
      });
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Transition Handoff
  |--------------------------------------------------------------------------
  |
  | This ONLY controls the exit of:
  |
  | - VITALIS MULWA
  | - 100
  |
  | The progress line is intentionally untouched.
  |
  | PageTransition timing is controlled externally.
  |
  */

  transitionOut(): Promise<void> {
    return new Promise((resolve) => {
      gsap.to([this.name, this.counter], {
        yPercent: -500,
        duration: 0.2,
        ease: "power3.in",
        stagger: 0,
        opacity: 0,
        overwrite: true,

        onComplete: resolve,
      });
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Remove
  |--------------------------------------------------------------------------
  |
  | Called ONLY after PageTransition has covered the loader.
  |
  */

  remove(): void {
    this.container.remove();
  }
}
