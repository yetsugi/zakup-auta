import "./scss/app.scss";

import App from "./js/app";

window.app = new App("#app");

window.addEventListener("popstate", () => window.app.render());
