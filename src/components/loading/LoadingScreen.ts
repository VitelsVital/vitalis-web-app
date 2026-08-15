// import gsap from "gsap";

// /*
// |--------------------------------------------------------------------------
// | Loading Screen
// |--------------------------------------------------------------------------
// |
// | Responsibilities:
// |
// | - Display the loading screen
// | - Animate the top progress line
// | - Reveal VITALIS MULWA from left → right
// | - Animate the percentage counter
// | - Resolve play() exactly at 100%
// | - Briefly lift the name and counter when transition starts
// | - Remove itself only after PageTransition has taken over
// |
// */

// export default class LoadingScreen {
//   private readonly container: HTMLDivElement;

//   private readonly progressLine: HTMLDivElement;

//   private readonly name: HTMLDivElement;

//   private readonly nameBright: HTMLDivElement;

//   private readonly counter: HTMLDivElement;

//   /*
//   |--------------------------------------------------------------------------
//   | Constructor
//   |--------------------------------------------------------------------------
//   */

//   constructor() {
//     /*
//     |--------------------------------------------------------------------------
//     | Container
//     |--------------------------------------------------------------------------
//     */

//     this.container = document.createElement("div");

//     this.container.className = "loading-screen";

//     /*
//     |--------------------------------------------------------------------------
//     | Progress Line
//     |--------------------------------------------------------------------------
//     */

//     this.progressLine = document.createElement("div");

//     this.progressLine.className = "loading-screen-line";

//     /*
//     |--------------------------------------------------------------------------
//     | Name
//     |--------------------------------------------------------------------------
//     */

//     this.name = document.createElement("div");

//     this.name.className = "loading-screen-name";

//     this.name.textContent = "VITALIS MULWA";

//     /*
//     |--------------------------------------------------------------------------
//     | Bright Name
//     |--------------------------------------------------------------------------
//     */

//     this.nameBright = document.createElement("div");

//     this.nameBright.className = "loading-screen-name-bright";

//     this.nameBright.textContent = "VITALIS MULWA";

//     this.name.appendChild(this.nameBright);

//     /*
//     |--------------------------------------------------------------------------
//     | Counter
//     |--------------------------------------------------------------------------
//     */

//     this.counter = document.createElement("div");

//     this.counter.className = "loading-screen-counter";

//     this.counter.textContent = "0";

//     /*
//     |--------------------------------------------------------------------------
//     | Assemble
//     |--------------------------------------------------------------------------
//     */

//     this.container.append(this.progressLine, this.name, this.counter);
//   }

//   /*
//   |--------------------------------------------------------------------------
//   | Render
//   |--------------------------------------------------------------------------
//   */

//   render(): HTMLDivElement {
//     return this.container;
//   }

//   /*
//   |--------------------------------------------------------------------------
//   | Play
//   |--------------------------------------------------------------------------
//   |
//   | Resolves EXACTLY when progress reaches 100%.
//   |
//   | It does not hide or remove the loader.
//   |
//   */

//   play(): Promise<void> {
//     return new Promise((resolve) => {
//       /*
//       |--------------------------------------------------------------------------
//       | Initial State
//       |--------------------------------------------------------------------------
//       */

//       gsap.set(this.container, {
//         autoAlpha: 1,
//       });

//       gsap.set(this.progressLine, {
//         scaleX: 0,

//         transformOrigin: "left center",
//       });

//       gsap.set(this.nameBright, {
//         clipPath: "inset(0 100% 0 0)",
//       });

//       /*
//       |--------------------------------------------------------------------------
//       | Reset Handoff Position
//       |--------------------------------------------------------------------------
//       |
//       | This is important in case the LoadingScreen is ever
//       | reused during the application lifecycle.
//       |
//       */

//       gsap.set([this.name, this.counter], {
//         y: 0,
//       });

//       /*
//       |--------------------------------------------------------------------------
//       | Shared Progress
//       |--------------------------------------------------------------------------
//       */

//       const progress = {
//         value: 0,
//       };

//       /*
//       |--------------------------------------------------------------------------
//       | Progress Animation
//       |--------------------------------------------------------------------------
//       */

//       gsap.to(progress, {
//         value: 100,

//         duration: 2.4,

//         ease: "power3.inOut",

//         /*
//           |--------------------------------------------------------------------------
//           | Update
//           |--------------------------------------------------------------------------
//           */

//         onUpdate: () => {
//           const value = Math.round(progress.value);

//           /*
//             |--------------------------------------------------------------------------
//             | Counter
//             |--------------------------------------------------------------------------
//             */

//           this.counter.textContent = `${value}`;

//           /*
//             |--------------------------------------------------------------------------
//             | Top Line
//             |--------------------------------------------------------------------------
//             */

//           gsap.set(this.progressLine, {
//             scaleX: progress.value / 100,
//           });

//           /*
//             |--------------------------------------------------------------------------
//             | Name
//             |--------------------------------------------------------------------------
//             */

//           gsap.set(this.nameBright, {
//             clipPath: `inset(0 ${100 - progress.value}% 0 0)`,
//           });
//         },

//         /*
//           |--------------------------------------------------------------------------
//           | Complete
//           |--------------------------------------------------------------------------
//           */

//         onComplete: () => {
//           /*
//             |--------------------------------------------------------------------------
//             | Guarantee Final State
//             |--------------------------------------------------------------------------
//             */

//           this.counter.textContent = "100";

//           gsap.set(this.progressLine, {
//             scaleX: 1,
//           });

//           gsap.set(this.nameBright, {
//             clipPath: "inset(0 0% 0 0)",
//           });

//           /*
//             |--------------------------------------------------------------------------
//             | IMPORTANT
//             |--------------------------------------------------------------------------
//             |
//             | The loader remains visible.
//             |
//             | main.ts will pause briefly and then start
//             | PageTransition.
//             |
//             */

//           resolve();
//         },
//       });
//     });
//   }

//   /*
//   |--------------------------------------------------------------------------
//   | Transition Handoff
//   |--------------------------------------------------------------------------
//   |
//   | Called at the exact moment PageTransition starts.
//   |
//   | The name and counter gently lift upward to create
//   | a sense of movement into the next page.
//   |
//   | The progress line intentionally remains stationary.
//   |
//   */

//   transitionOut(): Promise<void> {
//     return new Promise((resolve) => {
//       gsap.to([this.name, this.counter], {
//         y: -250,
//         duration: 0.3,
//         ease: "power3.Out",
//         stagger: 0,
//         opacity: 0,
//         overwrite: true,
//         onComplete: () => {
//           resolve();
//         },
//       });
//     });
//   }
//   /*
//   |--------------------------------------------------------------------------
//   | Remove
//   |--------------------------------------------------------------------------
//   |
//   | Called ONLY after PageTransition has covered the loader.
//   |
//   */

//   remove(): void {
//     this.container.remove();
//   }
// }

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
    |
    | Contains:
    |
    | - Name
    | - Counter
    |
    | The CSS controls their responsive positioning.
    |
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

        ease: "power3.inOut",

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
          |
          | Loader remains visible.
          |
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
  | Called when PageTransition starts.
  |
  | The name and counter move upward together.
  |
  | The progress line remains stationary.
  |
  */

  transitionOut(): Promise<void> {
    return new Promise((resolve) => {
      gsap.to([this.name, this.counter], {
        yPercent: -300,
        duration: 0.18,
        ease: "power3.Out",
        stagger: 0.01,
        opacity: 0,
        overwrite: true,
        onComplete: () => {
          resolve();
        },
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
