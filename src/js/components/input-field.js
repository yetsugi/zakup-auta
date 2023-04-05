export default class InputField {
  $el;
  $input;
  $errorMsg;

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
    this.$el.classList.add(
      this.isCheckable ? "checkable-field" : "input-field"
    );

    const $label = document.createElement("label");

    this.$input = document.createElement("input");
    this.$input.classList.add(
      this.isCheckable ? "checkable-field__input" : "input-field__input"
    );

    this.$input.type = "text";
    this.$input.id = this.id;
    this.$input.name = this.id;

    for (const [key, value] of Object.entries(this.attrs)) {
      this.$input[key] = value;
    }

    $label.setAttribute("for", this.$input.id);
    $label.innerText = this.label;

    if (!this.isCheckable) {
      this.$errorMsg = document.createElement("p");
      this.$errorMsg.classList.add("input-field__error-msg");
    }

    this.$el.append($label, this.$input);

    if (!this.isCheckable) {
      this.$el.append(this.$errorMsg);
    }

    if (this.isCheckable) {
      this.$el.addEventListener("click", (e) => {
        if (e.target.nodeName === "DIV") {
          this.$input.click();
          this.$input.focus();
        }
      });
    }
  }
}
