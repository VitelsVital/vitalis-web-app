// import gsap from "gsap";

// class PageTransition {

//   private container: HTMLDivElement;
//   private screenOne: HTMLDivElement;
//   private screenTwo: HTMLDivElement;

//   constructor() {
//     this.container =
//       document.createElement("div");

//     this.container.className =
//       "transition-container";

//     this.screenOne =
//       document.createElement("div");

//     this.screenOne.className =
//       "transition-screen-one";

//     this.screenOne.innerHTML = `
//       <div class="fixed-background primary">
//         <div class="texture"></div>
//       </div>
//     `;

//     this.screenTwo =
//       document.createElement("div");

//     this.screenTwo.className =
//       "transition-screen-two";

//     this.screenTwo.innerHTML = `
//       <div class="fixed-background secondary">
//         <div class="texture"></div>
//       </div>
//     `;

//     this.container.appendChild(
//       this.screenOne
//     );

//     this.container.appendChild(
//       this.screenTwo
//     );

//     document.body.appendChild(
//       this.container
//     );
//       this.reset();
//     }

//     reset(): void {

//       gsap.set(
//         this.container,
//         {
//           display: "none",
//         }
//       );

//       gsap.set(
//         this.screenOne,
//         {
//           yPercent: 5,
//         }
//       );

//       gsap.set(
//         this.screenTwo,
//         {
//           yPercent: 5,
//         }
//       );

//     }

//     cover(): Promise<void> {

//       gsap.set(
//         this.container,
//         {
//           display: "block",
//         }
//       );

//       gsap.set(
//         this.screenOne,
//         {
//           yPercent: 5,
//         }
//       );

//       gsap.set(
//         this.screenTwo,
//         {
//           yPercent: 5,
//         }
//       );

//       return new Promise(
//         (resolve) => {

//           const timeline =
//             gsap.timeline({
//               onComplete:
//                 resolve,
//             });

//             timeline.to(
//               this.screenTwo,  // Note: screenTwo FIRST
//               {
//                 yPercent: -200,
//                 duration: 1.0,
//                 ease: "power3.Out",
//               },
//               0  // Starts immediately at 0s
//             );

//             timeline.to(
//               this.screenOne,  // screenOne SECOND
//               {
//                 yPercent: -200,
//                 duration: 0.9,
//                 ease: "power3.Out",
//               },
//               0.15  // Starts 1 second later! ✅
//             );
//         }
//       );
//     }
// }

// export default PageTransition;

// import gsap from "gsap";

// class PageTransition {

//   private container: HTMLDivElement;
//   private screenOne: HTMLDivElement;
//   private screenTwo: HTMLDivElement;

//   constructor() {
//     this.container =
//       document.createElement("div");

//     this.container.className =
//       "transition-container";

//     this.screenOne =
//       document.createElement("div");

//     this.screenOne.className =
//       "transition-screen-one";

//     this.screenOne.innerHTML = `
//       <div class="fixed-background primary">
//         <div class="texture"></div>
//       </div>
//     `;

//     this.screenTwo =
//       document.createElement("div");

//     this.screenTwo.className =
//       "transition-screen-two";

//     this.screenTwo.innerHTML = `
//       <div class="fixed-background secondary">
//         <div class="texture"></div>
//       </div>
//     `;

//     this.container.appendChild(
//       this.screenOne
//     );

//     this.container.appendChild(
//       this.screenTwo
//     );

//     document.body.appendChild(
//       this.container
//     );
//       this.reset();
//     }

//     reset(): void {

//       gsap.set(
//         this.container,
//         {
//           display: "none",
//         }
//       );

//       gsap.set(
//         this.screenOne,
//         {
//           yPercent: 5,
//         }
//       );

//       gsap.set(
//         this.screenTwo,
//         {
//           yPercent: 5,
//         }
//       );

//     }

//     play(): Promise<void> {

//       gsap.set(
//         this.container,
//         {
//           display: "block",
//         }
//       );

//       gsap.set(
//         this.screenOne,
//         {
//           yPercent: 5,
//         }
//       );

//       gsap.set(
//         this.screenTwo,
//         {
//           yPercent: 5,
//         }
//       );

//       return new Promise(
//         (resolve) => {

//           const timeline =
//             gsap.timeline({
//               onComplete:
//                 resolve,
//             });

//             timeline.to(
//               this.screenTwo,  // Note: screenTwo FIRST
//               {
//                 yPercent: -200,
//                 duration: 1.0,
//                 ease: "power3.Out",
//               },
//               0  // Starts immediately at 0s
//             );

//             timeline.to(
//               this.screenOne,  // screenOne SECOND
//               {
//                 yPercent: -200,
//                 duration: 0.9,
//                 ease: "power3.Out",
//               },
//               0.15  // Starts 1 second later! ✅
//             );
//         }
//       );
//     }
// }

// export default PageTransition;

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

  private readonly CONTENT_TIME = 650;

  constructor() {
    this.container = document.createElement("div");

    this.container.className = "transition-container";

    this.screenOne = document.createElement("div");

    this.screenOne.className = "transition-screen-one";

    this.screenOne.innerHTML = `
      <div class="fixed-background primary">
        <div class="texture"></div>
      </div>
    `;

    this.screenTwo = document.createElement("div");

    this.screenTwo.className = "transition-screen-two";

    this.screenTwo.innerHTML = `
      <div class="fixed-background secondary">
        <div class="texture"></div>
      </div>
    `;

    this.container.appendChild(this.screenOne);

    this.container.appendChild(this.screenTwo);

    document.body.appendChild(this.container);

    this.reset();
  }

  reset(): void {
    gsap.set(this.container, {
      display: "block",
    });

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
  | Plays the transition and provides two independent
  | promises:
  |
  | contentReady → when the new page may be displayed
  | finished      → when the transition itself is complete
  |
  */

  play(): {
    contentReady: Promise<void>;
    finished: Promise<void>;
  } {
    gsap.set(this.container, {
      display: "block",
    });

    gsap.set(this.screenOne, {
      yPercent: 5,
    });

    gsap.set(this.screenTwo, {
      yPercent: 5,
    });

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
    */

    gsap.delayedCall(this.CONTENT_TIME / 1000, () => {
      contentResolve?.();
    });

    /*
    |--------------------------------------------------------------------------
    | Transition animation
    |--------------------------------------------------------------------------
    */

    const timeline = gsap.timeline({
      onComplete: () => {
        finishedResolve?.();
      },
    });

    /*
    |--------------------------------------------------------------------------
    | Screen Two
    |--------------------------------------------------------------------------
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

    return {
      contentReady,
      finished,
    };
  }
}

export default PageTransition;
