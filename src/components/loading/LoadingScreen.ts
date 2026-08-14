import gsap from "gsap";

/*
|--------------------------------------------------------------------------
| Loading Screen
|--------------------------------------------------------------------------
|
| Controls:
|
| - Top progress line
| - Center name reveal
| - Percentage counter
|
| All three are driven by the same GSAP progress value.
|
*/

export default class LoadingScreen {
  private readonly container: HTMLDivElement;

  private readonly progressLine: HTMLDivElement;

  private readonly name: HTMLDivElement;

  private readonly nameBright: HTMLDivElement;

  private readonly counter: HTMLDivElement;

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
        | Progress line
        |--------------------------------------------------------------------------
        */

    this.progressLine = document.createElement("div");

    this.progressLine.className = "loading-screen__line";

    /*
        |--------------------------------------------------------------------------
        | Name wrapper
        |--------------------------------------------------------------------------
        */

    this.name = document.createElement("div");

    this.name.className = "loading-screen__name";

    this.name.textContent = "VITALIS MULWA";

    /*
        |--------------------------------------------------------------------------
        | Bright name
        |--------------------------------------------------------------------------
        |
        | This sits directly on top of the dim name.
        | Its clip-path reveals from left → right.
        |
        */

    this.nameBright = document.createElement("div");

    this.nameBright.className = "loading-screen__name-bright";

    this.nameBright.textContent = "VITALIS MULWA";

    this.name.appendChild(this.nameBright);

    /*
        |--------------------------------------------------------------------------
        | Counter
        |--------------------------------------------------------------------------
        */

    this.counter = document.createElement("div");

    this.counter.className = "loading-screen__counter";

    this.counter.textContent = "0%";

    /*
        |--------------------------------------------------------------------------
        | Assemble
        |--------------------------------------------------------------------------
        */

    this.container.append(this.progressLine, this.name, this.counter);
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
    */

  play(): Promise<void> {
    return new Promise((resolve) => {
      /*
                |--------------------------------------------------------------------------
                | Initial state
                |--------------------------------------------------------------------------
                */

      gsap.set(this.container, {
        autoAlpha: 1,
      });

      gsap.set(this.progressLine, {
        scaleX: 0,
        transformOrigin: "left center",
      });

      gsap.set(this.nameBright, {
        clipPath: "inset(0 100% 0 0)",
      });

      /*
                |--------------------------------------------------------------------------
                | Progress object
                |--------------------------------------------------------------------------
                */

      const progress = {
        value: 0,
      };

      /*
                |--------------------------------------------------------------------------
                | Main progress animation
                |--------------------------------------------------------------------------
                */

      gsap.to(progress, {
        value: 100,

        duration: 2.4,

        ease: "power2.inOut",

        onUpdate: () => {
          const value = Math.round(progress.value);

          /*
           * Counter
           */

          this.counter.textContent = `${value}%`;

          /*
           * Top line
           */

          gsap.set(this.progressLine, {
            scaleX: progress.value / 100,
          });

          /*
           * Name brightness
           */

          gsap.set(this.nameBright, {
            clipPath: `inset(0 ${100 - progress.value}% 0 0)`,
          });
        },

        onComplete: () => {
          /*
           * Make absolutely sure
           * the final state is exact.
           */

          this.counter.textContent = "100%";

          gsap.set(this.progressLine, {
            scaleX: 1,
          });

          gsap.set(this.nameBright, {
            clipPath: "inset(0 0% 0 0)",
          });

          /*
                             |--------------------------------------------------------------------------
                             | Exit
                             |--------------------------------------------------------------------------
                             */

          gsap.to(this.container, {
            autoAlpha: 0,

            duration: 0.5,

            ease: "power2.inOut",

            delay: 0.15,

            onComplete: () => {
              this.container.remove();

              resolve();
            },
          });
        },
      });
    });
  }
}
