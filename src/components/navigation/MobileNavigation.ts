import Logo from "./Logo";
import Hamburger from "./Hamburger";

class MobileNavigation {
  private logo: Logo | null = null;
  private hamburger: Hamburger | null = null;

  render(): HTMLElement {
    const navigation = document.createElement("div");

    navigation.className = "mobile-navigation";

    const container = document.createElement("div");

    container.className = "mobile-navigation-inner";

    /*
     * Logo
     */
    this.logo = new Logo({
      variant: "icon",
      href: "/",
    });

    container.appendChild(this.logo.render());

    /*
     * Hamburger
     */
    this.hamburger = new Hamburger();

    container.appendChild(this.hamburger.render());

    /*
     * Navigation container
     */
    navigation.appendChild(container);

    return navigation;
  }

  getHamburger(): Hamburger | null {
    return this.hamburger;
  }

  setMenuOpen(open: boolean): void {
    this.hamburger?.setOpen(open);
  }

  destroy(): void {
    this.logo?.destroy();

    this.hamburger?.destroy();

    this.logo = null;
    this.hamburger = null;
  }
}

export default MobileNavigation;
