import { getCars, getCarsWhereBrandId } from "../Api";
import CarInfo from "./car-info";

export default class CarList {
  $el;

  constructor() {
    this.render();
  }

  async populate(brandId = null) {
    brandId = Number(brandId);

    this.$el.replaceChildren();

    let cars = [];
    if (brandId) {
      cars = await getCarsWhereBrandId(brandId);
    } else {
      cars = await getCars();
    }

    cars.forEach((car) => {
      const carInfo = new CarInfo(car);

      const $li = document.createElement("li");
      $li.dataset.carId = car.id;
      $li.appendChild(carInfo.$el);

      this.$el.appendChild($li);
    });
  }

  render() {
    this.$el = document.createElement("ul");

    this.populate();
  }
}
