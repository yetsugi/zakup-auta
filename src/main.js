import App from "./js/app";
import "./scss/app.scss";

window.app = new App("#app");

window.addEventListener("popstate", () => window.app.render());
