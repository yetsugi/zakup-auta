export default class ErrorView {
  $el;

  constructor() {
    this.render();
  }

  render() {
    this.$el = document.createElement("div");

    const $heading = document.createElement("h1");
    $heading.innerText = "Ups! Coś poszło nie tak..";

    const $paragraph = document.createElement("p");
    $paragraph.innerText = "Spróbuj odświeżyć stronę";

    this.$el.append($heading, $paragraph);
  }
}
