import { currencyFormatter, mileageFormatter } from "../helpers";

export default class CarInfo {
  $el;

  constructor(car) {
    this.car = car;

    this.render();
  }

  render() {
    this.$el = document.createElement("article");

    const $img = document.createElement("img");
    $img.src = this.car.img;
    $img.alt = `Zdjęcie ${this.car.brand} ${this.car.model}`;

    const $heading = document.createElement("h1");
    $heading.innerText = `${this.car.brand} ${this.car.model}`;

    const $attributes = document.createElement("dl");

    const $enginePowerDt = document.createElement("dt");
    $enginePowerDt.innerText = "Moc silnika";

    const $enginePowerDd = document.createElement("dd");
    $enginePowerDd.innerText = `${this.car.enginePower} KM`;

    const $yearDt = document.createElement("dt");
    $yearDt.innerText = "Rocznik";

    const $yearDd = document.createElement("dd");
    $yearDd.innerText = this.car.year;

    const $mileageDt = document.createElement("dt");
    $mileageDt.innerText = "Przebieg";

    const $mileageDd = document.createElement("dd");
    $mileageDd.innerText = mileageFormatter.format(this.car.mileage);

    const $price = document.createElement("p");
    $price.innerText = currencyFormatter.format(this.car.price);

    $attributes.appendChild($enginePowerDt);
    $attributes.appendChild($enginePowerDd);

    $attributes.appendChild($yearDt);
    $attributes.appendChild($yearDd);

    $attributes.appendChild($mileageDt);
    $attributes.appendChild($mileageDd);

    this.$el.appendChild($img);
    this.$el.appendChild($heading);
    this.$el.appendChild($attributes);
    this.$el.appendChild($price);
  }
}
