export default class NotFoundView {
  $el;

  constructor() {
    this.render();
  }

  render() {
    this.$el = document.createElement("div");

    const $heading = document.createElement("h1");
    $heading.innerText = "Nic tu nie ma..";

    this.$el.append($heading);
  }
}
