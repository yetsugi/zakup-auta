export default class InputField {
  $el;

  constructor(label, id, attrs = {}) {
    this.label = label;
    this.id = id;
    this.attrs = attrs;

    this.render();
  }

  render() {
    this.$el = document.createElement("div");
    this.$el.classList.add("input-field");

    const $label = document.createElement("label");
    $label.classList.add("input-field__label");

    const $input = document.createElement("input");
    $input.classList.add("input-field__input");

    $input.type = "text";
    $input.id = this.id;
    $input.name = this.id;

    for (const [key, value] of Object.entries(this.attrs)) {
      $input[key] = value;
    }

    $label.setAttribute("for", $input.id);
    $label.innerText = this.label;

    this.$el.append($label, $input);
  }
}
