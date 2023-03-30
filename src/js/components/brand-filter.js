import { getBrandFilterOptions } from "../Api";

export default class BrandFilter {
  $el;

  constructor() {
    this.render();
  }

  handleChange(event) {
    const selectedIndex = event.target.selectedIndex;

    sessionStorage.setItem("selected-brand-option", selectedIndex);
  }

  async populate() {
    const options = await getBrandFilterOptions();

    options.forEach((option, index) => this.$el.add(new Option(option, index)));
  }

  render() {
    this.$el = document.createElement("select");

    this.populate();

    this.$el.addEventListener("change", this.handleChange);
  }
}
