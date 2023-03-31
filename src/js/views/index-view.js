import BrandFilter from "../components/brand-filter";
import CarList from "../components/car-list";

export default class IndexView {
  $el;

  carList;

  constructor() {
    this.render();
  }

  changeBrand = (e) => {
    const brandId = e.target.value;

    this.carList.populate(brandId);
  };

  goToForm = (e) => {
    const $carLi = e.target.closest("li");

    if ($carLi) {
      sessionStorage.setItem("selected-car-id", $carLi.dataset.carId);

      window.app.goTo("form");
    }
  };

  render() {
    this.$el = document.createElement("div");
    this.$el.classList.add("index-view");

    const $heading = document.createElement("h1");
    $heading.innerText = "Samochody";
    $heading.classList.add("index-view__heading");

    const brandFilter = new BrandFilter();
    this.carList = new CarList();

    this.$el.appendChild($heading);
    this.$el.appendChild(brandFilter.$el);
    this.$el.appendChild(this.carList.$el);

    brandFilter.$select.addEventListener("change", this.changeBrand);
    this.carList.$el.addEventListener("click", this.goToForm);
  }
}
