import LoadingScreen from "./loading/LoadingScreen";
import PageTransition from "./page/PageTransition";
import MenuTransition from "./menu/MenuTransition";
import TransitionLayer from "./TransitionLayer";

export type MenuState = "closed" | "opening" | "open" | "closing";

class TransitionManager {
  /**
   * |--------------------------------------------------------------------------
   * | Global Transition Container
   * |--------------------------------------------------------------------------
   */

  private readonly container: HTMLDivElement;

  /**
   * |--------------------------------------------------------------------------
   * | Transition Systems
   * |--------------------------------------------------------------------------
   */

  private readonly transitionLayer: TransitionLayer;
  private readonly pageTransition: PageTransition;
  private readonly menuTransition: MenuTransition;

  /**
   * |--------------------------------------------------------------------------
   * | Loading Screen
   * |--------------------------------------------------------------------------
   *
   * One LoadingScreen component handles two modes:
   *
   * Homepage:
   *   Full loader with line, name and counter.
   *
   * Non-homepage:
   *   Blank dark cover only.
   *
   */

  private loadingScreen: LoadingScreen | null = null;

  /**
   * |--------------------------------------------------------------------------
   * | Homepage State
   * |--------------------------------------------------------------------------
   *
   * Determines which LoadingScreen mode should be created.
   *
   * This is evaluated once when TransitionManager is created.
   *
   */

  private readonly isHomepage: boolean;

  /**
   * |--------------------------------------------------------------------------
   * | Menu State
   * |--------------------------------------------------------------------------
   */

  private menuState: MenuState = "closed";

  /**
   * |--------------------------------------------------------------------------
   * | Constructor
   * |--------------------------------------------------------------------------
   */

  constructor() {
    /**
     * |--------------------------------------------------------------------------
     * | Determine Current Page
     * |--------------------------------------------------------------------------
     *
     * Only the exact homepage gets the actual loader.
     *
     * Examples:
     *
     * "/"          → true
     * "/index.html" → true
     *
     * "/work"      → false
     * "/about"     → false
     * "/contact"   → false
     * "/archive"   → false
     *
     */

    const pathname = window.location.pathname;

    this.isHomepage = pathname === "/" || pathname === "/index.html";

    /**
     * |--------------------------------------------------------------------------
     * | Global Container
     * |--------------------------------------------------------------------------
     */

    this.container = document.createElement("div");
    this.container.className = "loading-container";

    /**
     * |--------------------------------------------------------------------------
     * | Shared Transition Layer
     * |--------------------------------------------------------------------------
     */

    this.transitionLayer = new TransitionLayer();

    /**
     * |--------------------------------------------------------------------------
     * | Page Transition
     * |--------------------------------------------------------------------------
     */

    this.pageTransition = new PageTransition(this.transitionLayer);

    /**
     * |--------------------------------------------------------------------------
     * | Menu Transition
     * |--------------------------------------------------------------------------
     */

    this.menuTransition = new MenuTransition(this.transitionLayer);

    /**
     * |--------------------------------------------------------------------------
     * | Mount
     * |--------------------------------------------------------------------------
     */

    this.mount();
  }

  /**
   * |--------------------------------------------------------------------------
   * | Mount
   * |--------------------------------------------------------------------------
   */

  private mount(): void {
    this.container.appendChild(this.transitionLayer.getElement());

    document.body.prepend(this.container);
  }

  /**
   * |--------------------------------------------------------------------------
   * | Ensure Loading Screen
   * |--------------------------------------------------------------------------
   *
   * Creates ONE LoadingScreen instance.
   *
   * The mode is determined by isHomepage:
   *
   * true  → actual loader
   * false → blank dark cover
   *
   */

  private ensureLoadingScreen(): LoadingScreen {
    if (!this.loadingScreen) {
      this.loadingScreen = new LoadingScreen(
        this.transitionLayer,
        this.isHomepage,
      );

      this.container.prepend(this.loadingScreen.getElement());
    }

    return this.loadingScreen;
  }

  /**
   * |--------------------------------------------------------------------------
   * | LOADING SCREEN
   * |--------------------------------------------------------------------------
   *
   * Homepage:
   *
   *   0 → 100
   *
   * Non-homepage:
   *
   *   Immediately ready.
   *
   * In both cases the cover remains visible until
   * exitLoadingScreen() is called.
   *
   */

  playLoadingScreen(): Promise<void> {
    return this.ensureLoadingScreen().play();
  }

  /**
   * |--------------------------------------------------------------------------
   * | Loading Screen Exit
   * |--------------------------------------------------------------------------
   *
   * The same exit sequence is used for both modes.
   *
   * Homepage:
   *
   *   Loader at 100%
   *       ↓
   *   Curtains
   *       ↓
   *   Loader removed
   *
   * Non-homepage:
   *
   *   Blank dark cover
   *       ↓
   *   Curtains
   *       ↓
   *   Cover removed
   *
   */

  exitLoadingScreen(): Promise<void> {
    const loadingScreen = this.loadingScreen;

    if (!loadingScreen) {
      return Promise.resolve();
    }

    return loadingScreen.exit();
  }

  /**
   * |--------------------------------------------------------------------------
   * | PAGE TRANSITION
   * |--------------------------------------------------------------------------
   *
   * Used by Barba for:
   *
   * - Different-page navigation
   * - Back / Forward navigation
   *
   */

  playPageTransition(mode: "navigation" | "reload" = "navigation"): {
    contentReady: Promise<void>;
    finished: Promise<void>;
  } {
    return this.pageTransition.play(mode);
  }

  /**
   * |--------------------------------------------------------------------------
   * | MENU OPEN
   * |--------------------------------------------------------------------------
   */

  async openMenu(onMenuVisible?: () => void): Promise<void> {
    if (this.menuState === "open" || this.menuState === "opening") {
      return;
    }

    this.menuState = "opening";

    try {
      await this.menuTransition.open(onMenuVisible);

      this.menuState = "open";
    } catch (error) {
      this.menuState = "closed";

      throw error;
    }
  }

  /**
   * |--------------------------------------------------------------------------
   * | MENU CLOSE
   * |--------------------------------------------------------------------------
   */

  async closeMenu(onMenuHidden?: () => void): Promise<void> {
    if (this.menuState === "closed" || this.menuState === "closing") {
      return;
    }

    this.menuState = "closing";

    try {
      await this.menuTransition.close(onMenuHidden);

      this.menuState = "closed";
    } catch (error) {
      this.menuState = "closed";

      throw error;
    }
  }

  /**
   * |--------------------------------------------------------------------------
   * | MENU STATE
   * |--------------------------------------------------------------------------
   */

  getMenuState(): MenuState {
    return this.menuState;
  }

  /**
   * |--------------------------------------------------------------------------
   * | MENU OPEN CHECK
   * |--------------------------------------------------------------------------
   */

  isMenuOpen(): boolean {
    return this.menuState === "open" || this.menuState === "opening";
  }

  /**
   * |--------------------------------------------------------------------------
   * | GET LOADING SCREEN
   * |--------------------------------------------------------------------------
   */

  getLoadingScreen(): LoadingScreen | null {
    return this.loadingScreen;
  }

  /**
   * |--------------------------------------------------------------------------
   * | GET TRANSITION LAYER
   * |--------------------------------------------------------------------------
   */

  getTransitionLayer(): TransitionLayer {
    return this.transitionLayer;
  }

  /**
   * |--------------------------------------------------------------------------
   * | GET PAGE TRANSITION
   * |--------------------------------------------------------------------------
   */

  getPageTransition(): PageTransition {
    return this.pageTransition;
  }

  /**
   * |--------------------------------------------------------------------------
   * | GET MENU TRANSITION
   * |--------------------------------------------------------------------------
   */

  getMenuTransition(): MenuTransition {
    return this.menuTransition;
  }

  /**
   * |--------------------------------------------------------------------------
   * | GET GLOBAL CONTAINER
   * |--------------------------------------------------------------------------
   */

  getLoadingContainer(): HTMLDivElement {
    return this.container;
  }

  /**
   * |--------------------------------------------------------------------------
   * | Destroy
   * |--------------------------------------------------------------------------
   */

  destroy(): void {
    /**
     * |--------------------------------------------------------------------------
     * | Destroy Loading Screen
     * |--------------------------------------------------------------------------
     */

    this.loadingScreen?.destroy();

    /**
     * |--------------------------------------------------------------------------
     * | Destroy Page Transition
     * |--------------------------------------------------------------------------
     */

    this.pageTransition.destroy();

    /**
     * |--------------------------------------------------------------------------
     * | Destroy Menu Transition
     * |--------------------------------------------------------------------------
     */

    this.menuTransition.destroy();

    /**
     * |--------------------------------------------------------------------------
     * | Destroy Shared Transition Layer
     * |--------------------------------------------------------------------------
     */

    this.transitionLayer.destroy();

    /**
     * |--------------------------------------------------------------------------
     * | Reset State
     * |--------------------------------------------------------------------------
     */

    this.menuState = "closed";

    /**
     * |--------------------------------------------------------------------------
     * | Remove Global Container
     * |--------------------------------------------------------------------------
     */

    this.container.remove();
  }
}

export default TransitionManager;
