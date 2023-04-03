export default class InputField {
  $el;

  constructor(label, id, attrs = {}) {
    this.label = label;
    this.id = id;
    this.attrs = attrs;
    this.isCheckable = this.checkIfCheckable();

    this.render();
  }

  checkIfCheckable() {
    const checkables = ["radio", "checkbox"];

    return checkables.includes(this.attrs?.type);
  }

  render() {
    this.$el = document.createElement("div");
    this.$el.classList.add("input-field");
    if (this.isCheckable) {
      this.$el.classList.add("input-field--checkable");
    }

    const $label = document.createElement("label");
    $label.classList.add("input-field__label");
    if (this.isCheckable) {
      $label.classList.add("input-field__label--checkable");
    }

    const $input = document.createElement("input");
    $input.classList.add("input-field__input");
    if (this.isCheckable) {
      $input.classList.add("input-field__input--checkable");
    }

    $input.type = "text";
    $input.id = this.id;
    $input.name = this.id;

    for (const [key, value] of Object.entries(this.attrs)) {
      $input[key] = value;
    }

    $label.setAttribute("for", $input.id);
    $label.innerText = this.label;

    this.$el.append($label, $input);

    if (this.isCheckable) {
      this.$el.addEventListener("click", (e) => {
        if (e.target.nodeName === "DIV") {
          $input.click();
          $input.focus();
        }
      });
    }
  }
}
