import Logo from "./Logo";
import TextLink from "../links/TextLink";

class MainNavigation {
  private logo: Logo | null = null;
  private links: TextLink[] = [];

  private navigationLinks = [
    {
      text: "Work",
      href: "/work",
    },
    {
      text: "About",
      href: "/about",
    },
    {
      text: "Contact",
      href: "/contact",
    },
  ];

  render(): HTMLElement {
    const navigation = document.createElement("div");

    navigation.className = "main-navigation";

    /*
     * Logo
     */
    this.logo = new Logo({
      variant: "full",
      href: "/",
    });

    navigation.appendChild(this.logo.render());

    /*
     * Navigation links
     */
    const links = document.createElement("div");

    links.className = "main-navigation-links";

    this.navigationLinks.forEach(({ text, href }) => {
      const link = new TextLink({
        text,
        href,
        className: "main-navigation-link",
        dataLinkStatus: "not-active",
      });

      links.appendChild(link.render());

      this.links.push(link);
    });

    navigation.appendChild(links);

    return navigation;
  }

  destroy(): void {
    /*
     * Destroy logo
     */
    this.logo?.destroy();

    /*
     * Destroy navigation links
     */
    this.links.forEach((link) => {
      link.destroy();
    });

    /*
     * Reset references
     */
    this.logo = null;
    this.links = [];
  }
}

export default MainNavigation;
