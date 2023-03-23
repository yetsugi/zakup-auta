class Car {
  id;
  brand;
  model;
  year;
  enginePower;
  mileage;
  price;
  img;

  static indexInc = 1;

  constructor(
    brand,
    model,
    year,
    enginePower,
    mileage,
    price,
    img = "https://images.pexels.com/photos/2036544/pexels-photo-2036544.jpeg?cs=srgb&dl=pexels-prime-cinematics-2036544.jpg&fm=jpg&w=640&h=360"
  ) {
    this.id = Car.indexInc++;
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

class Accessory {
  id;
  name;
  price;

  static indexInc = 1;

  constructor(name, price) {
    this.id = Accessory.indexInc++;
    this.name = name;
    this.price = price;
  }

  get priceStr() {
    return `${this.price} zł`;
  }

  get nameStr() {
    return `${this.name} - ${this.priceStr}`;
  }
}

const cars = [
  new Car("Skoda", "Citigo", 2018, 11, 20000, 10000),
  new Car("Skoda", "Fabia", 2018, 22, 40000, 20000),
  new Car("Skoda", "Octavia", 2020, 33, 60000, 30000),
  new Car("Toyota", "Aygo", 2014, 44, 20000, 40000),
  new Car("Toyota", "Yaris", 2015, 55, 40000, 50000),
  new Car("Toyota", "Rav 4", 2016, 66, 60000, 60000),
];

const brandFilterOptions = [
  "Wszystkie",
  ...new Set(cars.map((car) => car.brand)),
];

const accessories = [
  new Accessory("Opony zimowe", 2000),
  new Accessory("Pakiet przeglądów", 3000),
  new Accessory("Dodatkowy rok gwarancji", 5000),
];

export function getCars() {
  return cars;
}

export function getCarById(carId) {
  carId = Number(carId);

  return cars.find((car) => car.id === carId);
}

export function getCarsWhereBrandId(brandId) {
  brandId = Number(brandId);

  if (brandId === 0) {
    return getCars();
  }

  const brand = brandFilterOptions[brandId];
  return cars.filter((car) => car.brand === brand);
}

export function getBrandFilterOptions() {
  return brandFilterOptions;
}

export function getAccessories() {
  return accessories;
}

export function getAccessoriesWhereIds(accessoriesIds) {
  accessoriesIds = accessoriesIds.map((accessoryId) => Number(accessoryId));

  return accessories.filter((accessory) =>
    accessoriesIds.includes(accessory.id)
  );
}
