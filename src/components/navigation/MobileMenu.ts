import TextLink from "../links/TextLink";

class MobileMenu {
  private element: HTMLDivElement | null = null;

  private links: TextLink[] = [];

  private linkElements: HTMLElement[] = [];

  private onNavigation: (() => void) | null = null;

  private navigationLinks = [
    {
      text: "Work",
      href: "/work/",
    },
    {
      text: "About",
      href: "/about/",
    },
    {
      text: "Contact",
      href: "/contact/",
    },
  ];

  /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

  render(): HTMLElement {
    const menu = document.createElement("div");

    menu.className = "mobile-menu";

    /*
        |--------------------------------------------------------------------------
        | Navigation links
        |--------------------------------------------------------------------------
        */

    this.navigationLinks.forEach(({ text, href }) => {
      const link = new TextLink({
        text,
        href,
        className: "anim-link",
        dataLinkStatus: "not-active",
      });

      const linkElement = link.render();

      /*
                |------------------------------------------------------------------
                | Notify MenuController
                |------------------------------------------------------------------
                */

      linkElement.addEventListener("click", this.handleNavigationClick);

      /*
                |------------------------------------------------------------------
                | Store references
                |------------------------------------------------------------------
                */

      this.linkElements.push(linkElement);

      this.links.push(link);

      menu.appendChild(linkElement);
    });

    /*
        |--------------------------------------------------------------------------
        | Store menu reference
        |--------------------------------------------------------------------------
        */

    this.element = menu;

    return menu;
  }

  /*
    |--------------------------------------------------------------------------
    | Navigation click
    |--------------------------------------------------------------------------
    */

  private handleNavigationClick = (): void => {
    this.onNavigation?.();
  };

  /*
    |--------------------------------------------------------------------------
    | Navigation callback
    |--------------------------------------------------------------------------
    */

  onNavigationClick(callback: () => void): void {
    this.onNavigation = callback;
  }

  /*
    |--------------------------------------------------------------------------
    | Get element
    |--------------------------------------------------------------------------
    */

  getElement(): HTMLDivElement | null {
    return this.element;
  }

  /*
    |--------------------------------------------------------------------------
    | Visibility
    |--------------------------------------------------------------------------
    */

  setVisible(visible: boolean): void {
    if (!this.element) {
      return;
    }

    this.element.style.display = visible ? "flex" : "none";
  }

  /*
    |--------------------------------------------------------------------------
    | Destroy
    |--------------------------------------------------------------------------
    */

  destroy(): void {
    /*
        |------------------------------------------------------------------
        | Remove navigation listeners
        |------------------------------------------------------------------
        */

    this.linkElements.forEach((element) => {
      element.removeEventListener("click", this.handleNavigationClick);
    });

    /*
        |------------------------------------------------------------------
        | Destroy TextLinks
        |------------------------------------------------------------------
        */

    this.links.forEach((link) => {
      link.destroy();
    });

    /*
        |------------------------------------------------------------------
        | Reset references
        |------------------------------------------------------------------
        */

    this.links = [];

    this.linkElements = [];

    this.onNavigation = null;

    /*
        |------------------------------------------------------------------
        | Remove menu
        |------------------------------------------------------------------
        */

    this.element?.remove();

    this.element = null;
  }
}

export default MobileMenu;
