import gsap from "gsap";

const LINE_OFFSET = 0;
const ANIMATION_DURATION = 0.25;

class Hamburger {
  private element: HTMLDivElement | null = null;

  private topLine: HTMLSpanElement | null = null;
  private middleLine: HTMLSpanElement | null = null;
  private bottomLine: HTMLSpanElement | null = null;

  private timeline: gsap.core.Timeline | null = null;

  private menuOpen = false;
  private isFloating = false;

  private onToggle: (() => void) | null = null;

  render(): HTMLElement {
    const hamburger = document.createElement("div");

    hamburger.className = "hamburger";

    hamburger.setAttribute("role", "button");
    hamburger.setAttribute("tabindex", "0");
    hamburger.setAttribute("aria-label", "Open menu");
    hamburger.setAttribute("aria-expanded", "false");

    /*
     * Lines
     */
    const topLine = document.createElement("span");
    topLine.className = "line one";

    const middleLine = document.createElement("span");
    middleLine.className = "line two";

    const bottomLine = document.createElement("span");
    bottomLine.className = "line three";

    hamburger.appendChild(topLine);
    hamburger.appendChild(middleLine);
    hamburger.appendChild(bottomLine);

    /*
     * Store references
     */
    this.element = hamburger;

    this.topLine = topLine;
    this.middleLine = middleLine;
    this.bottomLine = bottomLine;

    /*
     * Initial line state
     */
    gsap.set(this.topLine, {
      width: "40%",
    });

    gsap.set(this.middleLine, {
      width: "60%",
    });

    gsap.set(this.bottomLine, {
      width: "40%",
    });

    /*
     * Menu animation
     */
    this.timeline = gsap.timeline({
      paused: true,

      defaults: {
        duration: ANIMATION_DURATION,
        ease: "expo.inOut",
      },
    });

    this.timeline
      .to(
        this.topLine,
        {
          y: LINE_OFFSET,
          width: "50%",
          rotate: 45,
          backgroundColor: "#BD2018",
        },
        0,
      )

      .to(
        this.middleLine,
        {
          scaleX: 0,
          opacity: 0,
        },
        0,
      )

      .to(
        this.bottomLine,
        {
          y: -LINE_OFFSET,
          width: "50%",
          rotate: -45,
          backgroundColor: "#BD2018",
        },
        0,
      );

    /*
     * Mouse interaction
     */
    hamburger.addEventListener("click", this.handleClick);

    /*
     * Keyboard interaction
     */
    hamburger.addEventListener("keydown", this.handleKeyDown);

    return hamburger;
  }

  /*
   * Toggle menu
   */
  private handleClick = (): void => {
    this.setOpen(!this.menuOpen);

    this.onToggle?.();
  };

  /*
   * Keyboard accessibility
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();

    this.handleClick();
  };

  /*
   * Open / close menu
   */
  setOpen(open: boolean): void {
    if (!this.timeline || !this.element) {
      return;
    }

    this.menuOpen = open;

    this.element.setAttribute("aria-expanded", String(open));

    this.element.setAttribute("aria-label", open ? "Close menu" : "Open menu");

    if (open) {
      this.timeline.play();
    } else {
      this.timeline.reverse();
    }
  }

  /*
   * Set floating state
   *
   * The same hamburger is used both
   * inside the navigation and as the
   * floating hamburger after scrolling.
   */
  setFloating(floating: boolean): void {
    if (!this.element) {
      return;
    }

    this.isFloating = floating;

    this.element.classList.toggle("is-floating", floating);
  }

  /*
   * Get floating state
   */
  isFloatingState(): boolean {
    return this.isFloating;
  }

  /*
   * Get menu state
   */
  isOpen(): boolean {
    return this.menuOpen;
  }

  /*
   * Get DOM element
   */
  getElement(): HTMLDivElement | null {
    return this.element;
  }

  /*
   * Toggle callback
   */
  onToggleChange(callback: () => void): void {
    this.onToggle = callback;
  }

  /*
   * Cleanup
   */
  destroy(): void {
    this.timeline?.kill();

    this.element?.removeEventListener("click", this.handleClick);

    this.element?.removeEventListener("keydown", this.handleKeyDown);

    this.timeline = null;

    this.element = null;

    this.topLine = null;
    this.middleLine = null;
    this.bottomLine = null;

    this.onToggle = null;

    this.menuOpen = false;
    this.isFloating = false;
  }
}

export default Hamburger;
