import "./styles/normalize.css";
import "./styles/globalstyles.css";
import "./styles/styles.css";
import "./styles/components.css";

import Navigation from "./components/navigation/Navigation";
import { initBarba } from "./barba";


/*
|--------------------------------------------------------------------------
| Navigation
|--------------------------------------------------------------------------
*/

const navigation =
    new Navigation();

document.body.prepend(
    navigation.render()
);


/*
|--------------------------------------------------------------------------
| Barba container
|--------------------------------------------------------------------------
*/

const app =
    document.querySelector<HTMLElement>(
        '[data-barba="container"]'
    );

if (!app) {

    throw new Error(
        '[data-barba="container"] element not found.'
    );

}


/*
|--------------------------------------------------------------------------
| Initialize Barba
|--------------------------------------------------------------------------
*/

initBarba();