import { currencyFormatter, mileageFormatter } from "../helpers";

export default class CarInfo {
  $el;

  constructor(car) {
    this.car = car;

    this.render();
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

    const $attributes = document.createElement("dl");
    $attributes.classList.add("car-info__attributes");

    const $enginePowerDt = document.createElement("dt");
    $enginePowerDt.classList.add("car-info__attribute-name");
    $enginePowerDt.innerText = "Moc silnika";

    const $enginePowerDd = document.createElement("dd");
    $enginePowerDd.classList.add("car-info__attribute-value");
    $enginePowerDd.innerText = `${this.car.enginePower} KM`;

    const $yearDt = document.createElement("dt");
    $yearDt.classList.add("car-info__attribute-name");
    $yearDt.innerText = "Rok produkcji";

    const $yearDd = document.createElement("dd");
    $yearDd.classList.add("car-info__attribute-value");
    $yearDd.innerText = this.car.year;

    const $mileageDt = document.createElement("dt");
    $mileageDt.classList.add("car-info__attribute-name");
    $mileageDt.innerText = "Przebieg";

    const $mileageDd = document.createElement("dd");
    $mileageDd.classList.add("car-info__attribute-value");
    $mileageDd.innerText = mileageFormatter.format(this.car.mileage);

    const $price = document.createElement("p");
    $price.classList.add("car-info__price");
    $price.innerText = currencyFormatter.format(this.car.price);

    $imgWrapper.appendChild($img);

    $attributes.appendChild($enginePowerDt);
    $attributes.appendChild($enginePowerDd);

    $attributes.appendChild($yearDt);
    $attributes.appendChild($yearDd);

    $attributes.appendChild($mileageDt);
    $attributes.appendChild($mileageDd);

    this.$el.appendChild($imgWrapper);
    this.$el.appendChild($heading);
    this.$el.appendChild($attributes);
    this.$el.appendChild($price);
  }
}
