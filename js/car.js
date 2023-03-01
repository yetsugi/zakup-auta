export class Car {
  brand;
  model;
  year;
  enginePower;
  mileage;
  price;
  img;

  constructor(
    brand,
    model,
    year,
    enginePower,
    mileage,
    price,
    img = "https://images.pexels.com/photos/2036544/pexels-photo-2036544.jpeg?cs=srgb&dl=pexels-prime-cinematics-2036544.jpg&fm=jpg&w=640&h=360"
  ) {
    this.brand = brand;
    this.model = model;
    this.year = year;
    this.enginePower = enginePower;
    this.mileage = mileage;
    this.price = price;
    this.img = img;
  }

  get nameStr() {
    return `${this.brand} ${this.model}`;
  }

  get mileageStr() {
    return `${this.mileage} km`;
  }

  get enginePowerStr() {
    return `${this.enginePower} KM`;
  }

  get priceStr() {
    return `${this.price} zł`;
  }
}

export const cars = [
  new Car("Skoda", "Citigo", 2018, 0, 20000, 10000),
  new Car("Skoda", "Fabia", 2018, 0, 40000, 20000),
  new Car("Skoda", "Octavia", 2020, 0, 60000, 30000),
  new Car("Toyota", "Aygo", 2014, 0, 20000, 40000),
  new Car("Toyota", "Yaris", 2015, 0, 40000, 50000),
  new Car("Toyota", "Rav 4", 2016, 0, 60000, 60000),
];

export const brands = [...new Set(cars.map((car) => car.brand))];

export const brandFilterOptions = ["Wszystkie", ...brands];

class CarLiContent extends HTMLElement {
  constructor() {
    super();

    const $template = document.querySelector("#car-li-content");
    const $templateContent = $template.content;

    const $shadowRoot = this.attachShadow({ mode: "open" });
    $shadowRoot.appendChild($templateContent.cloneNode(true));

    const $carName = $shadowRoot.querySelector(".car-name");
    $carName.textContent = this.getAttribute("car-name");

    const $carImg = $shadowRoot.querySelector(".car-img");
    $carImg.setAttribute("src", this.getAttribute("car-img"));
    $carImg.setAttribute("alt", `${this.getAttribute("car-name")} photo.`);

    const $carYear = $shadowRoot.querySelector(".car-year");
    $carYear.textContent = this.getAttribute("car-year");

    const $carEnginePower = $shadowRoot.querySelector(".car-engine-power");
    $carEnginePower.textContent = this.getAttribute("car-engine-power");

    const $carMileage = $shadowRoot.querySelector(".car-mileage");
    $carMileage.textContent = this.getAttribute("car-mileage");

    const $carPrice = $shadowRoot.querySelector(".car-price");
    $carPrice.textContent = this.getAttribute("car-price");
  }
}

customElements.define("car-li-content", CarLiContent);
