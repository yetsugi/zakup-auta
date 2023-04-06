import "./scss/app.scss";
import "line-awesome/dist/line-awesome/css/line-awesome.css";

import App from "./js/app";

window.App = new App("#app");

window.App.render();

window.addEventListener("popstate", () => window.App.render());
