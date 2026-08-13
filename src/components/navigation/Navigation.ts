import MainNavigation from "./MainNavigation";

import MobileNavigation from "./MobileNavigation";

import FloatingHamburger from "./FloatingHamburger";

import MobileMenu from "./MobileMenu";

import MenuController from "../transitions/menu/MenuController";

class Navigation {
  private mainNavigation: MainNavigation;

  private mobileNavigation: MobileNavigation;

  private floatingHamburger: FloatingHamburger;

  private mobileMenu: MobileMenu;

  private menuController: MenuController;

  constructor() {
    /*
        |--------------------------------------------------------------------------
        | Navigation
        |--------------------------------------------------------------------------
        */

    this.mainNavigation = new MainNavigation();

    this.mobileNavigation = new MobileNavigation();

    this.floatingHamburger = new FloatingHamburger();

    this.mobileMenu = new MobileMenu();

    /*
        |--------------------------------------------------------------------------
        | Menu controller
        |--------------------------------------------------------------------------
        */

    this.menuController = new MenuController();
  }

  /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

  render(): HTMLElement {
    const navigation = document.createElement("nav");

    navigation.className = "navigation";

    /*
        |--------------------------------------------------------------------------
        | Main navigation
        |--------------------------------------------------------------------------
        */

    navigation.appendChild(this.mainNavigation.render());

    /*
        |--------------------------------------------------------------------------
        | Mobile navigation
        |--------------------------------------------------------------------------
        */

    navigation.appendChild(this.mobileNavigation.render());

    /*
        |--------------------------------------------------------------------------
        | Floating hamburger
        |--------------------------------------------------------------------------
        */

    navigation.appendChild(this.floatingHamburger.render());

    /*
        |--------------------------------------------------------------------------
        | Mobile menu
        |--------------------------------------------------------------------------
        */

    navigation.appendChild(this.mobileMenu.render());

    /*
        |--------------------------------------------------------------------------
        | Connect mobile menu
        |--------------------------------------------------------------------------
        */

    this.menuController.attachMobileMenu(this.mobileMenu);

    /*
        |--------------------------------------------------------------------------
        | Connect mobile hamburger
        |--------------------------------------------------------------------------
        */

    const mobileHamburger = this.mobileNavigation.getHamburger();

    if (mobileHamburger) {
      this.menuController.attachMobileHamburger(mobileHamburger);
    }

    /*
        |--------------------------------------------------------------------------
        | Connect floating hamburger
        |--------------------------------------------------------------------------
        */

    const floatingHamburger = this.floatingHamburger.getHamburger();

    if (floatingHamburger) {
      this.menuController.attachFloatingHamburger(floatingHamburger);
    }

    /*
        |--------------------------------------------------------------------------
        | Active navigation links
        |--------------------------------------------------------------------------
        */

    this.updateActiveLinks();

    return navigation;
  }

  /*
    |--------------------------------------------------------------------------
    | Active links
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
    this.menuController.destroy();

    this.mainNavigation.destroy();

    this.mobileNavigation.destroy();

    this.floatingHamburger.destroy();

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

  getFloatingHamburger(): FloatingHamburger {
    return this.floatingHamburger;
  }

  getMobileMenu(): MobileMenu {
    return this.mobileMenu;
  }

  getMenuController(): MenuController {
    return this.menuController;
  }
}

export default Navigation;
