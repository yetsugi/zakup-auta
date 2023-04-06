import ErrorView from "./views/error-view";
import FormView from "./views/form-view";
import IndexView from "./views/index-view";
import NotFoundView from "./views/not-found-view";
import SummaryView from "./views/summary-view";

export default class App {
  constructor(mount) {
    this.$el = document.querySelector(mount);
  }

  getCurrentView() {
    const params = new URLSearchParams(location.search);
    const view = params.get("view");

    if (view === "summary") {
      return new SummaryView();
    }

    if (view === "form") {
      return new FormView();
    }

    if (!view || view === "index") {
      return new IndexView();
    }

    return new NotFoundView();
  }

  goTo(view) {
    const url = new URL(location.toString());
    const params = new URLSearchParams(url.search);

    params.set("view", view);
    url.search = params.toString();

    history.pushState({}, "", url.toString());

    this.render();
  }

  renderError() {
    const view = new ErrorView();

    this.$el.replaceChildren();

    this.$el.append(view.$el);
  }

  render() {
    try {
      const view = this.getCurrentView();

      this.$el.replaceChildren();

      this.$el.append(view.$el);
    } catch (err) {
      this.renderError();
    }
  }
}
