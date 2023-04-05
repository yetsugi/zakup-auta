import "./scss/app.scss";
import "line-awesome/dist/line-awesome/css/line-awesome.css";

import App from "./js/app";

window.app = new App("#app");

window.addEventListener("popstate", () => window.app.render());
