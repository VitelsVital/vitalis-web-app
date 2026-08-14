import gsap from "gsap";

class MenuTransition {
  private container: HTMLDivElement;

  private screenOne: HTMLDivElement;

  private screenTwo: HTMLDivElement;

  /*
  |--------------------------------------------------------------------------
  | MENU VISIBILITY TIMING
  |--------------------------------------------------------------------------
  |
  | These values are completely independent from the
  | screen animation durations.
  |
  */

  private readonly OPEN_MENU_TIME = 0.2;

  private readonly CLOSE_MENU_TIME = 0.3;

  constructor() {
    /*
    |--------------------------------------------------------------------------
    | Container
    |--------------------------------------------------------------------------
    */

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
  | The screens are then reset to their
  | starting position while invisible.
  |
  */

  private reset(): void {
    /*
    |--------------------------------------------------------------------------
    | Stop any running animations
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
  | OPEN
  |--------------------------------------------------------------------------
  |
  | Screen One leads.
  | Screen One is the TOP layer.
  |
  */

  open(onMenuVisible?: () => void): Promise<void> {
    /*
    |--------------------------------------------------------------------------
    | Prepare transition
    |--------------------------------------------------------------------------
    */

    this.reset();

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
    | Layering
    |--------------------------------------------------------------------------
    */

    gsap.set(this.screenOne, {
      zIndex: 2,
    });

    gsap.set(this.screenTwo, {
      zIndex: 1,
    });

    /*
    |--------------------------------------------------------------------------
    | Timeline
    |--------------------------------------------------------------------------
    */

    return new Promise((resolve) => {
      const timeline = gsap.timeline({
        onComplete: () => {
          /*
              |--------------------------------------------------------------------------
              | Animation is finished.
              |--------------------------------------------------------------------------
              |
              | Hide the container FIRST.
              |
              */

          gsap.set(this.container, {
            display: "none",
          });

          /*
              |--------------------------------------------------------------------------
              | Reset screens SECOND.
              |--------------------------------------------------------------------------
              |
              | They are now invisible, so this reset
              | cannot create a visual jump.
              |
              */

          gsap.set(this.screenOne, {
            yPercent: 5,
          });

          gsap.set(this.screenTwo, {
            yPercent: 5,
          });

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
        | Screen One
        |--------------------------------------------------------------------------
        */

      timeline.to(
        this.screenOne,
        {
          yPercent: -200,
          duration: 1.0,
          ease: "power3.out",
        },
        0,
      );

      /*
        |--------------------------------------------------------------------------
        | Screen Two
        |--------------------------------------------------------------------------
        */

      timeline.to(
        this.screenTwo,
        {
          yPercent: -200,
          duration: 0.9,
          ease: "power3.out",
        },
        0.15,
      );

      /*
        |--------------------------------------------------------------------------
        | MOBILE MENU VISIBILITY
        |--------------------------------------------------------------------------
        |
        | Deliberately independent from the
        | animation completion.
        |
        */

      timeline.call(
        () => {
          onMenuVisible?.();
        },
        [],
        this.OPEN_MENU_TIME,
      );
    });
  }

  /*
  |--------------------------------------------------------------------------
  | CLOSE
  |--------------------------------------------------------------------------
  |
  | Screen Two leads.
  | Screen Two is the TOP layer.
  |
  */

  close(onMenuHidden?: () => void): Promise<void> {
    /*
    |--------------------------------------------------------------------------
    | Prepare transition
    |--------------------------------------------------------------------------
    */

    this.reset();

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
    | Layering
    |--------------------------------------------------------------------------
    */

    gsap.set(this.screenTwo, {
      zIndex: 2,
    });

    gsap.set(this.screenOne, {
      zIndex: 1,
    });

    /*
    |--------------------------------------------------------------------------
    | Timeline
    |--------------------------------------------------------------------------
    */

    return new Promise((resolve) => {
      const timeline = gsap.timeline({
        onComplete: () => {
          /*
              |--------------------------------------------------------------------------
              | Animation is finished.
              |--------------------------------------------------------------------------
              |
              | Hide container FIRST.
              |
              */

          gsap.set(this.container, {
            display: "none",
          });

          /*
              |--------------------------------------------------------------------------
              | Reset screens SECOND.
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
              | Resolve
              |--------------------------------------------------------------------------
              */

          resolve();
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
          ease: "power3.out",
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
          ease: "power3.out",
        },
        0.15,
      );

      /*
        |--------------------------------------------------------------------------
        | MOBILE MENU VISIBILITY
        |--------------------------------------------------------------------------
        |
        | Deliberately independent from the
        | animation completion.
        |
        */

      timeline.call(
        () => {
          onMenuHidden?.();
        },
        [],
        this.CLOSE_MENU_TIME,
      );
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Destroy
  |--------------------------------------------------------------------------
  */

  destroy(): void {
    gsap.killTweensOf([this.screenOne, this.screenTwo]);

    this.container.remove();
  }
}

export default MenuTransition;
