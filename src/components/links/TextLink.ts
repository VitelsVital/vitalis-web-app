import { gsap } from "gsap";
import SplitType from "split-type";

interface TextLinkOptions {
    text: string;
    href: string;
    className?: string;
    onClick?: (event: MouseEvent) => void;
    isHovered?: boolean;
    dataLinkStatus?: "active" | "not-active";
}

class TextLink {
    private text: string;
    private href: string;
    private className: string;
    private onClick?: (event: MouseEvent) => void;

    private externalIsHovered?: boolean;
    private internalIsHovered = false;
    private isHovered = false;

    private dataLinkStatus: "active" | "not-active";

    private container: HTMLAnchorElement | null = null;
    private pri: HTMLDivElement | null = null;
    private sec: HTMLDivElement | null = null;

    private splitPri: SplitType | null = null;
    private splitSec: SplitType | null = null;

    private priChars: Element[] = [];
    private secChars: Element[] = [];

    private animationTimeline: gsap.core.Timeline | null = null;

    constructor({
        text,
        href,
        className = "",
        onClick,
        isHovered,
        dataLinkStatus = "not-active",
    }: TextLinkOptions) {
        this.text = text;
        this.href = href;
        this.className = className;
        this.onClick = onClick;

        this.externalIsHovered = isHovered;
        this.dataLinkStatus = dataLinkStatus;

        this.isHovered =
            isHovered !== undefined
                ? isHovered
                : this.internalIsHovered;

        this.handleMouseEnter =
            this.handleMouseEnter.bind(this);

        this.handleMouseLeave =
            this.handleMouseLeave.bind(this);

        this.handleClick =
            this.handleClick.bind(this);
    }

    /**
     * Create and return the TextLink element
     */
    render(): HTMLAnchorElement {
        const container =
            document.createElement("a");

        container.href = this.href;

        container.className =
            `anim-link ${this.className}`.trim();

        container.dataset.linkStatus =
            this.dataLinkStatus;

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "anim-link-text-wrapper";

        const pri =
            document.createElement("div");

        pri.className =
            "anim-link-text pri";

        pri.textContent =
            this.text;

        const sec =
            document.createElement("div");

        sec.className =
            "anim-link-text sec";

        sec.textContent =
            this.text;

        wrapper.appendChild(pri);
        wrapper.appendChild(sec);

        container.appendChild(wrapper);

        this.container = container;
        this.pri = pri;
        this.sec = sec;

        container.addEventListener(
            "mouseenter",
            this.handleMouseEnter
        );

        container.addEventListener(
            "mouseleave",
            this.handleMouseLeave
        );

        container.addEventListener(
            "click",
            this.handleClick
        );

        this.initialize();

        return container;
    }

    /**
     * Initialize SplitType
     */
    private initialize(): void {
        const pri = this.pri;
        const sec = this.sec;

        if (!pri || !sec) return;

        this.cleanupAnimations();

        try {
            /*
             * Split primary text
             */
            this.splitPri = new SplitType(pri, {
                types: "words,chars",
                wordClass: "single-word",
                charClass: "single-char",
            });

            /*
             * Split secondary text
             */
            this.splitSec = new SplitType(sec, {
                types: "words,chars",
                wordClass: "single-word",
                charClass: "single-char",
            });

            /*
             * Words
             */
            const priWords =
                pri.querySelectorAll(
                    ".single-word"
                );

            const secWords =
                sec.querySelectorAll(
                    ".single-word"
                );

            gsap.set(priWords, {
                display: "inline-block",
                position: "relative",
            });

            gsap.set(secWords, {
                display: "inline-block",
                position: "relative",
            });

            /*
             * Characters
             */
            const priChars =
                pri.querySelectorAll(
                    ".single-char"
                );

            const secChars =
                sec.querySelectorAll(
                    ".single-char"
                );

            /*
             * Wrap primary characters
             */
            priChars.forEach((char) => {
                const content =
                    char.textContent ?? "";

                const element =
                    char as HTMLElement;

                element.style.position =
                    "relative";

                element.style.display =
                    "inline-block";

                element.innerHTML = `
                    <span class="single-char-inner">
                        ${content}
                    </span>
                `;
            });

            /*
             * Wrap secondary characters
             */
            secChars.forEach((char) => {
                const content =
                    char.textContent ?? "";

                const element =
                    char as HTMLElement;

                element.style.position =
                    "relative";

                element.style.display =
                    "inline-block";

                element.innerHTML = `
                    <span class="single-char-inner">
                        ${content}
                    </span>
                `;
            });

            /*
             * Get inner characters
             */
            const priInnerChars =
                pri.querySelectorAll(
                    ".single-char-inner"
                );

            const secInnerChars =
                sec.querySelectorAll(
                    ".single-char-inner"
                );

            this.priChars =
                Array.from(priInnerChars);

            this.secChars =
                Array.from(secInnerChars);

            /*
             * IMPORTANT:
             *
             * Do not use clearProps here.
             *
             * Primary text starts in place.
             */
            gsap.set(this.priChars, {
                y: "0%",
                opacity: 1,
            });

            /*
             * Secondary text starts below
             * the visible text.
             */
            gsap.set(this.secChars, {
                y: "100%",
                opacity: 0,
            });

        } catch (error) {
            console.error(
                "TextLink initialization error:",
                error
            );
        }
    }

    /**
     * Mouse enter
     */
    private handleMouseEnter(): void {
        if (
            this.externalIsHovered ===
            undefined
        ) {
            this.internalIsHovered = true;
            this.isHovered = true;

            this.animate();
        }
    }

    /**
     * Mouse leave
     */
    private handleMouseLeave(): void {
        if (
            this.externalIsHovered ===
            undefined
        ) {
            this.internalIsHovered = false;
            this.isHovered = false;

            this.animate();
        }
    }

    /**
     * Click
     */
    private handleClick(
        event: MouseEvent
    ): void {
        if (this.onClick) {
            this.onClick(event);
        }
    }

    /**
     * Hover animation
     */
    private animate(): void {
        const priChars =
            this.priChars;

        const secChars =
            this.secChars;

        if (
            priChars.length === 0 ||
            secChars.length === 0
        ) {
            return;
        }

        /*
         * Kill existing character tweens
         */
        gsap.killTweensOf(priChars);
        gsap.killTweensOf(secChars);

        /*
         * Kill existing timeline
         */
        if (this.animationTimeline) {
            this.animationTimeline.kill();
            this.animationTimeline = null;
        }

        /*
         * Create animation timeline
         */
        const tl = gsap.timeline({
            paused: false,

            onComplete: () => {
                if (
                    this.animationTimeline ===
                    tl
                ) {
                    this.animationTimeline =
                        null;
                }
            },
        });

        /*
         * HOVER
         *
         * Primary:
         * 0% → -100%
         *
         * Secondary:
         * 100% → 0%
         */
        if (this.isHovered) {
            tl.to(priChars, {
                y: "-100%",
                opacity: 0,
                duration: 0.5,
                ease: "power3.inOut",
                stagger: {
                    each: 0.005,
                    from: "start",
                },
                overwrite: true,
            }).to(
                secChars,
                {
                    y: "0%",
                    opacity: 1,
                    duration: 0.5,
                    ease: "power3.inOut",
                    stagger: {
                        each: 0.005,
                        from: "start",
                    },
                    overwrite: true,
                },
                0
            );
        }

        /*
         * MOUSE LEAVE
         *
         * Primary:
         * -100% → 0%
         *
         * Secondary:
         * 0% → 100%
         */
        else {
            tl.to(priChars, {
                y: "0%",
                opacity: 1,
                duration: 0.5,
                ease: "power3.inOut",
                stagger: {
                    each: 0.005,
                    from: "start",
                },
                overwrite: true,
            }).to(
                secChars,
                {
                    y: "100%",
                    opacity: 0,
                    duration: 0.5,
                    ease: "power3.inOut",
                    stagger: {
                        each: 0.005,
                        from: "start",
                    },
                    overwrite: true,
                },
                0
            );
        }

        this.animationTimeline = tl;
    }

    /**
     * Programmatically control hover
     */
    setHovered(value: boolean): void {
        this.externalIsHovered =
            value;

        this.isHovered =
            value;

        this.animate();
    }

    /**
     * Cleanup GSAP and SplitType
     */
    private cleanupAnimations(): void {
        if (this.priChars.length > 0) {
            gsap.killTweensOf(
                this.priChars
            );
        }

        if (this.secChars.length > 0) {
            gsap.killTweensOf(
                this.secChars
            );
        }

        if (this.animationTimeline) {
            this.animationTimeline.kill();
            this.animationTimeline = null;
        }

        if (this.splitPri) {
            try {
                this.splitPri.revert();
            } catch {
                // Ignore revert errors
            }

            this.splitPri = null;
        }

        if (this.splitSec) {
            try {
                this.splitSec.revert();
            } catch {
                // Ignore revert errors
            }

            this.splitSec = null;
        }

        this.priChars = [];
        this.secChars = [];
    }

    /**
     * Destroy component
     */
    destroy(): void {
        this.cleanupAnimations();

        if (this.container) {
            this.container.removeEventListener(
                "mouseenter",
                this.handleMouseEnter
            );

            this.container.removeEventListener(
                "mouseleave",
                this.handleMouseLeave
            );

            this.container.removeEventListener(
                "click",
                this.handleClick
            );
        }

        this.container = null;
        this.pri = null;
        this.sec = null;
    }
}

export default TextLink;