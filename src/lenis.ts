import Lenis from "lenis";

/*
|--------------------------------------------------------------------------
| Lenis Instance
|--------------------------------------------------------------------------
*/

let lenis: Lenis | null = null;

/*
|--------------------------------------------------------------------------
| Initialize Lenis
|--------------------------------------------------------------------------
*/

export function initLenis(): Lenis {
  if (lenis) {
    return lenis;
  }

  lenis = new Lenis();

  const raf = (time: number): void => {
    lenis?.raf(time);

    requestAnimationFrame(raf);
  };

  requestAnimationFrame(raf);

  return lenis;
}

/*
|--------------------------------------------------------------------------
| Get Lenis
|--------------------------------------------------------------------------
*/

export function getLenis(): Lenis {
  if (!lenis) {
    throw new Error("[Lenis] Lenis has not been initialized.");
  }

  return lenis;
}
