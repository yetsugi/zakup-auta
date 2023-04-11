export default class FormFieldset {
  $el;

  constructor(legend) {
    this.legend = legend;

    this.render();
  }

  render() {
    this.$el = document.createElement("fieldset");
    this.$el.classList.add("form-fieldset");

    const $legend = document.createElement("legend");
    $legend.classList.add("form-fieldset__legend");
    $legend.innerText = this.legend;

    this.$el.append($legend);
  }
}
