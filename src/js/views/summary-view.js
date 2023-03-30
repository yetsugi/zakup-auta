export default class SummaryView {
  $el;

  constructor() {
    this.render();
  }

  render() {
    this.$el = document.createElement("div");

    const p = document.createElement("p");
    p.innerText = "summary";

    this.$el.appendChild(p);
  }
}
