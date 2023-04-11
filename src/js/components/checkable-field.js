export default class CheckableField {
  $el;
  $input;
  $errorMsg;

  constructor(label, id, attrs = {}) {
    this.label = label;
    this.id = id;
    this.attrs = attrs;

    this.render();
  }

  handleClick = (e) => {
    if (e.target.nodeName === "DIV") {
      this.$input.click();
      this.$input.focus();
    }
  };

  render() {
    this.$el = document.createElement("div");
    this.$el.classList.add("checkable-field");

    const $label = document.createElement("label");

    this.$input = document.createElement("input");
    this.$input.classList.add("checkable-field__input");

    this.$input.type = "text";
    this.$input.id = this.id;
    this.$input.name = this.id;

    for (const [key, value] of Object.entries(this.attrs)) {
      this.$input[key] = value;
    }

    $label.setAttribute("for", this.$input.id);
    $label.innerText = this.label;

    this.$el.append($label, this.$input);

    this.$el.addEventListener("click", this.handleClick);
  }
}
