import { getBrandFilterOptions } from "../api";

export default class BrandFilter {
  $el;

  constructor() {
    this.render();
  }

  async populate() {
    const options = await getBrandFilterOptions();

    options.forEach((option, index) => this.$el.add(new Option(option, index)));
  }

  render() {
    this.$el = document.createElement("select");

    this.populate();
  }
}
