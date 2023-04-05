import { currencyFormatter, mileageFormatter } from "../helpers";

export default class CarInfo {
  $el;

  constructor(car) {
    this.car = car;

    this.render();
  }

  makeAttribute(title, value, icon) {
    const $attribute = document.createElement("p");
    $attribute.classList.add("car-info__attribute");

    const $icon = document.createElement("i");
    $icon.classList.add("las", icon);
    $icon.title = title;

    $attribute.append($icon, ` ${value}`);

    return $attribute;
  }

  render() {
    this.$el = document.createElement("article");
    this.$el.classList.add("car-info");

    const $imgWrapper = document.createElement("div");
    $imgWrapper.classList.add("car-info__img-wrapper");

    const $img = document.createElement("img");
    $img.classList.add("car-info__img");
    $img.src = this.car.img;
    $img.alt = `Zdjęcie ${this.car.brand} ${this.car.model}`;

    const $heading = document.createElement("h1");
    $heading.classList.add("car-info__heading");
    $heading.innerText = `${this.car.brand} ${this.car.model}`;

    const $attributes = document.createElement("div");
    $attributes.classList.add("car-info__attributes");

    const $year = this.makeAttribute(
      "Rok produkcji",
      this.car.year,
      "la-calendar"
    );

    const $mileage = this.makeAttribute(
      "Przebieg",
      mileageFormatter.format(this.car.mileage),
      "la-road"
    );

    const $fuel = this.makeAttribute("Paliwo", this.car.fuel, "la-gas-pump");

    const $enginePower = this.makeAttribute(
      "Moc silnika",
      `${this.car.enginePower} KM`,
      "la-cog"
    );

    const $price = document.createElement("p");
    $price.classList.add("car-info__price");
    $price.innerText = currencyFormatter.format(this.car.price);

    $imgWrapper.append($img);

    $attributes.append($year, $mileage, $fuel, $enginePower);

    this.$el.append($imgWrapper, $heading, $attributes, $price);
  }
}
