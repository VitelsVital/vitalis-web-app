import MainNavigation from "./MainNavigation";
import MobileNavigation from "./MobileNavigation";
// import FloatingHamburger from "./FloatingHamburger";
import MobileMenu from "./MobileMenu";

import TransitionManager from "../transitions/TransitionManager";

class Navigation {
  /*
  |--------------------------------------------------------------------------
  | Navigation Components
  |--------------------------------------------------------------------------
  */

  private mainNavigation: MainNavigation;

  private mobileNavigation: MobileNavigation;

  // private floatingHamburger: FloatingHamburger;

  private mobileMenu: MobileMenu;

  /*
  |--------------------------------------------------------------------------
  | Transition Manager
  |--------------------------------------------------------------------------
  |
  | The Navigation does not own MenuTransition.
  |
  | TransitionManager is responsible for:
  |
  | - PageTransition
  | - MenuTransition
  | - LoadingScreen
  | - Menu state
  |
  */

  private transitionManager: TransitionManager;

  /*
  |--------------------------------------------------------------------------
  | Constructor
  |--------------------------------------------------------------------------
  */

  constructor(transitionManager: TransitionManager) {
    this.mainNavigation = new MainNavigation();

    this.mobileNavigation = new MobileNavigation();

    // this.floatingHamburger = new FloatingHamburger();

    this.mobileMenu = new MobileMenu();

    this.transitionManager = transitionManager;
  }

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  |
  | Creates:
  |
  | <nav class="navigation">
  |   MainNavigation
  |   MobileNavigation
  |   FloatingHamburger
  |   MobileMenu
  | </nav>
  |
  | The caller is responsible for placing this navigation
  | between the loading container and the Barba container.
  |
  */

  render(): HTMLElement {
    const navigation = document.createElement("nav");

    navigation.className = "navigation";

    /*
    |--------------------------------------------------------------------------
    | Main Navigation
    |--------------------------------------------------------------------------
    */

    navigation.appendChild(this.mainNavigation.render());

    /*
    |--------------------------------------------------------------------------
    | Mobile Navigation
    |--------------------------------------------------------------------------
    */

    navigation.appendChild(this.mobileNavigation.render());

    /*
    |--------------------------------------------------------------------------
    | Floating Hamburger
    |--------------------------------------------------------------------------
    */

    // navigation.appendChild(this.floatingHamburger.render());

    /*
    |--------------------------------------------------------------------------
    | Mobile Menu
    |--------------------------------------------------------------------------
    */

    navigation.appendChild(this.mobileMenu.render());

    /*
    |--------------------------------------------------------------------------
    | Initial Menu State
    |--------------------------------------------------------------------------
    */

    this.mobileMenu.setVisible(false);

    /*
    |--------------------------------------------------------------------------
    | Mobile Hamburger
    |--------------------------------------------------------------------------
    */

    const mobileHamburger = this.mobileNavigation.getHamburger();

    if (mobileHamburger) {
      mobileHamburger.onToggleChange(() => {
        this.handleHamburgerToggle(mobileHamburger);
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Floating Hamburger
    |--------------------------------------------------------------------------
    |
    | Uses the exact same menu transition system.
    |
    */

    // const floatingHamburger = this.floatingHamburger.getHamburger();

    // if (floatingHamburger) {
    //   floatingHamburger.onToggleChange(() => {
    //     this.handleHamburgerToggle(floatingHamburger);
    //   });
    // }

    /*
    |--------------------------------------------------------------------------
    | Active Navigation Links
    |--------------------------------------------------------------------------
    */

    this.updateActiveLinks();

    /*
    |--------------------------------------------------------------------------
    | Return Navigation
    |--------------------------------------------------------------------------
    */

    return navigation;
  }

  /*
  |--------------------------------------------------------------------------
  | Hamburger Toggle
  |--------------------------------------------------------------------------
  */

  private handleHamburgerToggle(
    source: ReturnType<MobileNavigation["getHamburger"]>,
  ): void {
    if (!source) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Requested State
    |--------------------------------------------------------------------------
    |
    | Hamburger has already updated its visual state.
    |
    */

    const requestedOpen = source.isOpen();

    /*
    |--------------------------------------------------------------------------
    | Current Menu State
    |--------------------------------------------------------------------------
    */

    const state = this.transitionManager.getMenuState();

    /*
    |--------------------------------------------------------------------------
    | Prevent Interaction During Transition
    |--------------------------------------------------------------------------
    */

    // if (state === "opening" || state === "closing") {
    //   this.syncHamburgers(state === "opening");

    //   return;
    // }

    /*
    |--------------------------------------------------------------------------
    | Open
    |--------------------------------------------------------------------------
    */

    if (requestedOpen) {
      void this.openMenu();

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Close
    |--------------------------------------------------------------------------
    */

    void this.closeMenu();
  }

  /*
  |--------------------------------------------------------------------------
  | Open Menu
  |--------------------------------------------------------------------------
  |
  | Sequence:
  |
  | Hamburger → X
  |        ↓
  | MenuTransition.open()
  |        ↓
  | Menu becomes visible
  |        ↓
  | Transition finishes
  |
  */

  private async openMenu(): Promise<void> {
    /*
    |--------------------------------------------------------------------------
    | Synchronize Both Hamburgers
    |--------------------------------------------------------------------------
    */

    // this.syncHamburgers(true);

    /*
    |--------------------------------------------------------------------------
    | Run Menu Transition
    |--------------------------------------------------------------------------
    */

    await this.transitionManager.openMenu(() => {
      this.mobileMenu.setVisible(true);
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Close Menu
  |--------------------------------------------------------------------------
  |
  | Normal close:
  |
  | Hamburger → normal
  |        ↓
  | MenuTransition.close()
  |        ↓
  | Menu becomes hidden
  |        ↓
  | Transition finishes
  |
  | When a navigation link is clicked while the menu is open,
  | the larger navigation/page-transition orchestration can
  | take over.
  |
  */

  private async closeMenu(): Promise<void> {
    /*
    |--------------------------------------------------------------------------
    | Synchronize Both Hamburgers
    |--------------------------------------------------------------------------
    */

    // this.syncHamburgers(false);

    /*
    |--------------------------------------------------------------------------
    | Run Menu Transition
    |--------------------------------------------------------------------------
    */

    await this.transitionManager.closeMenu(() => {
      this.mobileMenu.setVisible(false);
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Synchronize Hamburgers
  |--------------------------------------------------------------------------
  |
  | Mobile and floating hamburger always represent
  | the same menu state.
  |
  */

  // private syncHamburgers(open: boolean): void {
  //   this.mobileNavigation.getHamburger()?.setOpen(open);

  //   this.floatingHamburger.getHamburger()?.setOpen(open);
  // }

  /*
  |--------------------------------------------------------------------------
  | Active Navigation Links
  |--------------------------------------------------------------------------
  */

  private updateActiveLinks(): void {
    const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";

    const links = document.querySelectorAll<HTMLAnchorElement>(
      "a[data-link-status]",
    );

    links.forEach((link) => {
      const linkPath =
        new URL(link.href, window.location.origin).pathname.replace(
          /\/+$/,
          "",
        ) || "/";

      link.dataset.linkStatus =
        linkPath === currentPath ? "active" : "not-active";
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Destroy
  |--------------------------------------------------------------------------
  */

  destroy(): void {
    this.mainNavigation.destroy();

    this.mobileNavigation.destroy();

    // this.floatingHamburger.destroy();

    this.mobileMenu.destroy();
  }

  /*
  |--------------------------------------------------------------------------
  | Getters
  |--------------------------------------------------------------------------
  */

  getMobileNavigation(): MobileNavigation {
    return this.mobileNavigation;
  }

  // getFloatingHamburger(): FloatingHamburger {
  //   return this.floatingHamburger;
  // }

  getMobileMenu(): MobileMenu {
    return this.mobileMenu;
  }
}

export default Navigation;
