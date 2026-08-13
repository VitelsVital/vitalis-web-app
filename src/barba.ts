import barba from "@barba/core";

import PageTransition
    from "./components/transitions/page/PageTransition";


export function initBarba(): void {

    const transition =
        new PageTransition();


    /*
    |--------------------------------------------------------------------------
    | Active navigation
    |--------------------------------------------------------------------------
    |
    | Updates every navigation link that uses
    | data-link-status.
    |
    | This includes:
    |
    | - Main navigation
    | - Mobile navigation
    | - Any future navigation links
    |
    */

    const updateActiveLinks = (): void => {

        const currentPath =
            window.location.pathname
                .replace(/\/+$/, "") || "/";


        const links =
            document.querySelectorAll<HTMLAnchorElement>(
                "a[data-link-status]"
            );


        links.forEach(
            (link) => {

                const linkPath =
                    new URL(
                        link.href,
                        window.location.origin
                    )
                    .pathname
                    .replace(/\/+$/, "") || "/";


                link.dataset.linkStatus =
                    linkPath === currentPath
                        ? "active"
                        : "not-active";

            }
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Current transition
    |--------------------------------------------------------------------------
    |
    | Stores the currently running transition so Barba does not
    | start a second transition during normal link navigation.
    |
    */

    let transitionRun:
        ReturnType<PageTransition["play"]> | null = null;


    /*
    |--------------------------------------------------------------------------
    | Refresh detection
    |--------------------------------------------------------------------------
    */

    const navigationEntry =
        performance.getEntriesByType(
            "navigation"
        )[0] as PerformanceNavigationTiming | undefined;


    const isReload =
        navigationEntry?.type === "reload";


    if (isReload) {

        requestAnimationFrame(
            () => {

                const currentTransition =
                    transition.play();


                currentTransition.contentReady.then(
                    () => {

                        document.documentElement.classList.remove(
                            "is-refreshing"
                        );


                        /*
                         * Refresh active navigation state.
                         */

                        updateActiveLinks();

                    }
                );

            }
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Initial active navigation state
    |--------------------------------------------------------------------------
    */

    updateActiveLinks();


    /*
    |--------------------------------------------------------------------------
    | Start transition on pointer down
    |--------------------------------------------------------------------------
    |
    | This starts the transition immediately when an internal
    | link is pressed.
    |
    */

    document.addEventListener(
        "pointerdown",
        (event: PointerEvent) => {

            /*
             * Only primary mouse button.
             */

            if (
                event.pointerType === "mouse" &&
                event.button !== 0
            ) {
                return;
            }


            const target =
                event.target as HTMLElement;


            const link =
                target.closest(
                    "a"
                ) as HTMLAnchorElement | null;


            if (!link) {
                return;
            }


            /*
             * Internal links only.
             */

            if (
                link.origin !==
                window.location.origin
            ) {
                return;
            }


            /*
             * Ignore special links.
             */

            if (
                link.target &&
                link.target !== "_self"
            ) {
                return;
            }


            if (
                link.hasAttribute(
                    "download"
                )
            ) {
                return;
            }


            /*
            |--------------------------------------------------------------------------
            | Current and destination URLs
            |--------------------------------------------------------------------------
            */

            const current =
                new URL(
                    window.location.href
                );


            const destination =
                new URL(
                    link.href
                );


            /*
            |--------------------------------------------------------------------------
            | Same-page link
            |--------------------------------------------------------------------------
            |
            | Clicking a link pointing to the current page
            | behaves like a refresh.
            |
            */

            if (
                destination.href ===
                current.href
            ) {

                window.location.reload();

                return;

            }


            /*
            |--------------------------------------------------------------------------
            | Different internal page
            |--------------------------------------------------------------------------
            |
            | Start the transition immediately.
            |
            */

            transitionRun =
                transition.play();

        },
        true
    );


    /*
    |--------------------------------------------------------------------------
    | Barba
    |--------------------------------------------------------------------------
    */

    barba.init({

        debug: true,

        preventRunning: true,

        transitions: [

            {

                name:
                    "page-transition",


                /*
                |--------------------------------------------------------------------------
                | Leave
                |--------------------------------------------------------------------------
                */

                async leave(data) {

                    console.log(
                        "[Barba] LEAVE:",
                        data.current.namespace,
                        "→",
                        data.next.namespace
                    );


                    /*
                     * Normal internal link:
                     *
                     * pointerdown has already started
                     * the transition.
                     */

                    if (transitionRun) {

                        const currentTransition =
                            transitionRun;


                        transitionRun =
                            null;


                        /*
                         * Allow Barba to continue when
                         * CONTENT_TIME is reached.
                         */

                        await currentTransition.contentReady;

                        return;

                    }


                    /*
                     * Back / Forward:
                     *
                     * There was no pointerdown,
                     * so start the same transition here.
                     */

                    const currentTransition =
                        transition.play();


                    /*
                     * Release the new content at
                     * CONTENT_TIME.
                     */

                    await currentTransition.contentReady;

                },


                /*
                |--------------------------------------------------------------------------
                | Enter
                |--------------------------------------------------------------------------
                */

                async enter(data) {

    console.log(
        "[Barba] ENTER:",
        data.next.namespace
    );


    /*
     * Update active navigation state
     * after the new page has entered.
     */

    updateActiveLinks();

},

            },

        ],

    });

}