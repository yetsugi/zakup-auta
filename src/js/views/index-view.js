import BrandFilter from "../components/brand-filter";
import CarList from "../components/car-list";

export default class IndexView {
  $el;

  carList;

  constructor() {
    this.render();
  }

  changeBrand = (e) => {
    const brandId = e.target.selectedIndex;

    this.carList.populate(brandId);
  };

  goToForm = (e) => {
    const $carLi = e.target.closest("li");

    if ($carLi) {
      sessionStorage.setItem("selected-car", $carLi.dataset.carId);

      window.app.goTo("form");
    }
  };

  render() {
    this.$el = document.createElement("div");

    const $heading = document.createElement("h1");
    $heading.innerText = "Samochody";

    const brandFilter = new BrandFilter();
    this.carList = new CarList();

    brandFilter.$el.addEventListener("change", this.changeBrand);
    this.carList.$el.addEventListener("click", this.goToForm);

    this.$el.appendChild($heading);
    this.$el.appendChild(brandFilter.$el);
    this.$el.appendChild(this.carList.$el);
  }
}
