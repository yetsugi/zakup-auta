export default class ErrorView {
  $el;

  constructor(heading, paragraph = "") {
    this.heading = heading;
    this.paragraph = paragraph;

    this.render();
  }

  render() {
    this.$el = document.createElement("div");
    this.$el.classList.add("error-view");

    const $heading = document.createElement("h1");
    $heading.classList.add("error-view__heading");
    $heading.innerText = this.heading;

    this.$el.append($heading);

    if (this.paragraph) {
      const $paragraph = document.createElement("p");
      $paragraph.innerText = this.paragraph;

      this.$el.append($paragraph);
    }
  }
}
