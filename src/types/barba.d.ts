declare module "@barba/core" {
  interface BarbaContainer {
    container: HTMLElement;

    namespace: string;
  }

  type BarbaTrigger = HTMLElement | "back" | "forward";

  interface BarbaTransitionData {
    current: BarbaContainer;

    next: BarbaContainer;

    trigger: BarbaTrigger;
  }

  interface BarbaTransition {
    name?: string;

    beforeLeave?(data: BarbaTransitionData): void;

    leave?(data: BarbaTransitionData): unknown;

    afterLeave?(data: BarbaTransitionData): void;

    beforeEnter?(data: BarbaTransitionData): void;

    enter?(data: BarbaTransitionData): unknown;

    afterEnter?(data: BarbaTransitionData): void;
  }

  interface BarbaOptions {
    debug?: boolean;

    preventRunning?: boolean;

    transitions?: BarbaTransition[];
  }

  interface Barba {
    init(options?: BarbaOptions): void;
  }

  const barba: Barba;

  export default barba;
}
