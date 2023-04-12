import { getCars, getCarsWhereBrandId } from "../api";
import CarInfo from "./car-info";

export default class CarList {
  $el;

  constructor() {
    this.render();
  }

  async populate(brandId = null, noTransition = false) {
    brandId = Number(brandId);

    this.$el.classList.remove("car-list--fade-in");

    setTimeout(
      async () => {
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
          $li.classList.add("car-list__item");
          $li.dataset.carId = car.id;
          $li.append(carInfo.$el);

          this.$el.append($li);
        });

        this.$el.classList.add("car-list--fade-in");
      },
      noTransition ? null : 750
    );
  }

  render() {
    this.$el = document.createElement("ul");
    this.$el.classList.add("car-list");

    this.populate(null, true);
  }
}
