import BrandFilter from "../components/brand-filter";
import CarList from "../components/car-list";

export default class IndexView {
  $el;

  carList;

  constructor() {
    sessionStorage.clear();

    this.render();
  }

  changeBrand = (e) => {
    e.target.classList.add("brand-filter__select--active");

    const brandId = e.target.value;
    this.carList.populate(brandId);
  };

  goToForm = (e) => {
    const $carLi = e.target.closest("li");

    if ($carLi) {
      sessionStorage.setItem("selected-car-id", $carLi.dataset.carId);

      window.App.goTo("form");
    }
  };

  render() {
    this.$el = document.createElement("div");
    this.$el.classList.add("index-view");

    const $heading = document.createElement("h1");
    $heading.classList.add("index-view__heading");
    $heading.innerText = "Samochody";

    const brandFilter = new BrandFilter();
    this.carList = new CarList();

    this.$el.append($heading, brandFilter.$el, this.carList.$el);

    brandFilter.$select.addEventListener("change", this.changeBrand);
    this.carList.$el.addEventListener("click", this.goToForm);
  }
}
