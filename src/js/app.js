import FormView from "./views/form-view";
import IndexView from "./views/index-view";
import SummaryView from "./views/summary-view";

export default class App {
  constructor(mount) {
    this.$el = document.querySelector(mount);

    this.render();
  }

  getCurrentView() {
    const params = new URLSearchParams(location.search);
    const view = params.get("view");

    console.log(location);

    switch (view) {
      case "form":
        return new FormView();
      case "summary":
        return new SummaryView();
      default:
        return new IndexView();
    }
  }

  goTo(view) {
    const url = new URL(location.toString());
    const params = new URLSearchParams(url.search);

    params.set("view", view);
    url.search = params.toString();

    history.pushState({}, "", url.toString());

    this.render();
  }

  render() {
    const view = this.getCurrentView();

    console.log(view);
    this.$el.replaceChildren();

    this.$el.append(view.$el);
  }
}
