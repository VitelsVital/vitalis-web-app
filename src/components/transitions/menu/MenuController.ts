import Hamburger from "../../navigation/Hamburger";

import MobileMenu from "../../navigation/MobileMenu";

import MenuTransition from "./MenuTransition";

type MenuState = "closed" | "opening" | "open" | "closing";

class MenuController {
  private mobileHamburger: Hamburger | null = null;

  private floatingHamburger: Hamburger | null = null;

  private mobileMenu: MobileMenu | null = null;

  private transition: MenuTransition;

  private state: MenuState = "closed";

  constructor() {
    this.transition = new MenuTransition();
  }

  /*
    |--------------------------------------------------------------------------
    | Attach mobile hamburger
    |--------------------------------------------------------------------------
    */

  attachMobileHamburger(hamburger: Hamburger): void {
    this.mobileHamburger = hamburger;

    hamburger.onToggleChange(this.handleMobileToggle);
  }

  /*
    |--------------------------------------------------------------------------
    | Attach floating hamburger
    |--------------------------------------------------------------------------
    */

  attachFloatingHamburger(hamburger: Hamburger): void {
    this.floatingHamburger = hamburger;

    hamburger.onToggleChange(this.handleFloatingToggle);
  }

  /*
    |--------------------------------------------------------------------------
    | Attach mobile menu
    |--------------------------------------------------------------------------
    */

  attachMobileMenu(mobileMenu: MobileMenu): void {
    this.mobileMenu = mobileMenu;

    /*
     * Menu starts hidden.
     */

    mobileMenu.setVisible(false);

    /*
     * When a mobile navigation link
     * is clicked, close the menu.
     */

    mobileMenu.onNavigationClick(this.handleMobileMenuNavigation);
  }

  /*
    |--------------------------------------------------------------------------
    | Mobile hamburger toggle
    |--------------------------------------------------------------------------
    */

  private handleMobileToggle = (): void => {
    this.handleToggle(this.mobileHamburger);
  };

  /*
    |--------------------------------------------------------------------------
    | Floating hamburger toggle
    |--------------------------------------------------------------------------
    */

  private handleFloatingToggle = (): void => {
    this.handleToggle(this.floatingHamburger);
  };

  /*
    |--------------------------------------------------------------------------
    | Mobile menu navigation
    |--------------------------------------------------------------------------
    */

  private handleMobileMenuNavigation = (): void => {
    /*
     * If the menu is open,
     * close it through the same
     * transition system.
     */

    if (this.state === "open") {
      this.close();
    }
  };

  /*
    |--------------------------------------------------------------------------
    | Handle hamburger toggle
    |--------------------------------------------------------------------------
    */

  private handleToggle(source: Hamburger | null): void {
    if (!source) {
      return;
    }

    /*
     * Hamburger has already changed
     * its visual state before this callback.
     */

    const requestedOpen = source.isOpen();

    /*
     * Do not allow another interaction
     * to interrupt an active transition.
     */

    if (this.state === "opening" || this.state === "closing") {
      this.syncHamburgers(this.state === "opening");

      return;
    }

    if (requestedOpen) {
      this.open();
    } else {
      this.close();
    }
  }

  /*
    |--------------------------------------------------------------------------
    | OPEN
    |--------------------------------------------------------------------------
    */

  private async open(): Promise<void> {
    if (this.state !== "closed") {
      return;
    }

    this.state = "opening";

    /*
     * Hamburger → X
     */

    this.syncHamburgers(true);

    /*
     * Run opening transition.
     *
     * MenuTransition controls the exact
     * moment the mobile menu becomes visible.
     */

    await this.transition.open(() => {
      this.mobileMenu?.setVisible(true);
    });

    /*
     * Transition is completely finished.
     */

    this.state = "open";
  }

  /*
    |--------------------------------------------------------------------------
    | CLOSE
    |--------------------------------------------------------------------------
    */

  private async close(): Promise<void> {
    if (this.state !== "open") {
      return;
    }

    this.state = "closing";

    /*
     * Hamburger → normal state
     */

    this.syncHamburgers(false);

    /*
     * Run closing transition.
     *
     * MenuTransition controls the exact
     * moment the mobile menu disappears.
     */

    await this.transition.close(() => {
      this.mobileMenu?.setVisible(false);
    });

    /*
     * Transition is completely finished.
     */

    this.state = "closed";
  }

  /*
    |--------------------------------------------------------------------------
    | Synchronize hamburgers
    |--------------------------------------------------------------------------
    */

  private syncHamburgers(open: boolean): void {
    this.mobileHamburger?.setOpen(open);

    this.floatingHamburger?.setOpen(open);
  }

  /*
    |--------------------------------------------------------------------------
    | State
    |--------------------------------------------------------------------------
    */

  getState(): MenuState {
    return this.state;
  }

  isOpen(): boolean {
    return this.state === "open" || this.state === "opening";
  }

  /*
    |--------------------------------------------------------------------------
    | Destroy
    |--------------------------------------------------------------------------
    */

  destroy(): void {
    this.transition.destroy();

    this.mobileHamburger = null;

    this.floatingHamburger = null;

    this.mobileMenu = null;

    this.state = "closed";
  }
}

export default MenuController;
