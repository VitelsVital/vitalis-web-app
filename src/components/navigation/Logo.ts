import { gsap } from "gsap";
import TextLink from "../links/TextLink";
import logoIcon from "../../assets/images/Logo.svg";

interface LogoOptions {
  name?: string;
  variant?: "full" | "icon";
  href?: string;
  className?: string;
}

class Logo {
  private name: string;
  private variant: "full" | "icon";
  private href: string;
  private className: string;

  private container: HTMLAnchorElement | null = null;
  private icon: HTMLImageElement | null = null;

  private textLink: TextLink | null = null;

  private timeline: gsap.core.Timeline | null = null;

  constructor({
    name = "VITALIS MULWA",
    variant = "full",
    href = "/",
    className = "",
  }: LogoOptions = {}) {
    this.name = name;
    this.variant = variant;
    this.href = href;
    this.className = className;

    this.handleMouseEnter = this.handleMouseEnter.bind(this);

    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  /**
   * Render Logo
   */
  render(): HTMLAnchorElement {
    const logo = document.createElement("a");

    logo.href = this.href;

    logo.className =
      `vitalis-mulwa vitalis-mulwa--${this.variant} ${this.className}`.trim();

    /*
     * Active state
     */
    const currentPath = this.normalizePath(window.location.pathname);

    const targetPath = this.normalizePath(this.href);

    const isActive = currentPath === targetPath;

    logo.dataset.linkStatus = isActive ? "active" : "not-active";

    /*
     * Logo icon wrapper
     */
    const iconWrapper = document.createElement("div");

    iconWrapper.className = "vm-logo-icon";

    /*
     * Logo icon
     */
    const icon = document.createElement("img");

    icon.src = logoIcon;

    icon.alt = `Crafted by ${this.name}`;

    // icon.width = 40;
    // icon.height = 40;

    iconWrapper.appendChild(icon);

    logo.appendChild(iconWrapper);

    this.container = logo;
    this.icon = icon;

    /*
     * Full logo
     */
    if (this.variant === "full") {
      this.textLink = new TextLink({
        text: this.name,
        href: this.href,
        isHovered: false,
        dataLinkStatus: isActive ? "active" : "not-active",
      });

      logo.appendChild(this.textLink.render());
    }

    /*
     * Hover events
     */
    logo.addEventListener("mouseenter", this.handleMouseEnter);

    logo.addEventListener("mouseleave", this.handleMouseLeave);

    /*
     * Create GSAP animation
     */
    this.createTimeline();

    return logo;
  }

  /**
   * Create GSAP icon rotation
   */
  private createTimeline(): void {
    if (!this.icon) return;

    this.timeline = gsap.timeline({
      paused: true,
    });

    this.timeline.to(this.icon, {
      rotation: 360,
      duration: 0.5,
      ease: "power3.inOut",
      transformOrigin: "50% 50%",
    });
  }

  /**
   * Mouse enter
   */
  private handleMouseEnter(): void {
    this.timeline?.play();

    this.textLink?.setHovered(true);
  }

  /**
   * Mouse leave
   */
  private handleMouseLeave(): void {
    this.timeline?.reverse();

    this.textLink?.setHovered(false);
  }

  /**
   * Normalize path
   */
  private normalizePath(path: string): string {
    if (path === "" || path === "/") {
      return "/";
    }

    return path.replace(/\/$/, "");
  }

  /**
   * Destroy
   */
  destroy(): void {
    /*
     * Kill GSAP
     */
    this.timeline?.kill();

    this.timeline = null;

    /*
     * Destroy TextLink
     */
    this.textLink?.destroy();

    this.textLink = null;

    /*
     * Remove listeners
     */
    if (this.container) {
      this.container.removeEventListener("mouseenter", this.handleMouseEnter);

      this.container.removeEventListener("mouseleave", this.handleMouseLeave);
    }

    this.container = null;
    this.icon = null;
  }
}

export default Logo;
