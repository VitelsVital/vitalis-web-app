import Hamburger from "./Hamburger";

const SCROLL_THRESHOLD = 120;

class FloatingHamburger {
  private container: HTMLDivElement | null = null;

  private hamburger: Hamburger | null = null;

  private isVisible = false;

  /**
   * Render floating hamburger
   */
  render(): HTMLElement {
    const container = document.createElement("div");

    container.className = "floating-hamburger";

    /*
     * Hamburger
     */
    this.hamburger = new Hamburger();

    container.appendChild(this.hamburger.render());

    /*
     * Store reference
     */
    this.container = container;

    /*
     * Listen for scroll
     */
    window.addEventListener("scroll", this.handleScroll, { passive: true });

    /*
     * Set initial visibility
     */
    this.updateVisibility();

    return container;
  }

  /**
   * Handle scroll
   */
  private handleScroll = (): void => {
    this.updateVisibility();
  };

  /**
   * Update visibility
   */
  private updateVisibility(): void {
    const shouldShow = window.scrollY > SCROLL_THRESHOLD;

    if (shouldShow === this.isVisible) {
      return;
    }

    this.isVisible = shouldShow;

    this.container?.classList.toggle("is-visible", this.isVisible);
  }

  /**
   * Get hamburger
   */
  getHamburger(): Hamburger | null {
    return this.hamburger;
  }

  /**
   * Set hamburger state
   */
  setOpen(open: boolean): void {
    this.hamburger?.setOpen(open);
  }

  /**
   * Destroy
   */
  destroy(): void {
    window.removeEventListener("scroll", this.handleScroll);

    this.hamburger?.destroy();

    this.container = null;

    this.hamburger = null;

    this.isVisible = false;
  }
}

export default FloatingHamburger;
