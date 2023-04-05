import { getBrandFilterOptions } from "../api";

export default class BrandFilter {
  $el;
  $select;

  constructor() {
    this.render();
  }

  async populate() {
    const $placeholder = new Option("Marka");
    $placeholder.disabled = true;
    $placeholder.selected = true;
    $placeholder.hidden = true;

    this.$select.add($placeholder);

    const options = await getBrandFilterOptions();
    console.log(options);

    options.forEach((option, index) =>
      this.$select.add(new Option(option, index))
    );
  }

  render() {
    this.$el = document.createElement("div");
    this.$el.classList.add("brand-filter");

    this.$select = document.createElement("select");
    this.$select.classList.add("brand-filter__select");

    this.$el.append(this.$select);

    this.populate();
  }
}
