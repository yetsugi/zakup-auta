export class Car {
  id;
  brand;
  model;
  year;
  enginePower;
  mileage;
  price;
  img;

  static indexInc = 0;

  constructor(
    brand,
    model,
    year,
    enginePower,
    mileage,
    price,
    img = "https://images.pexels.com/photos/2036544/pexels-photo-2036544.jpeg?cs=srgb&dl=pexels-prime-cinematics-2036544.jpg&fm=jpg&w=640&h=360"
  ) {
    this.id = ++Car.indexInc;
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
