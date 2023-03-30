export async function getCars() {
  const cars = await fetch("/api/cars.json").then((res) => res.json());

  return cars ?? [];
}

export async function getCarById(carId) {
  carId = Number(carId);

  const cars = await getCars();

  return cars.find((car) => car.id === carId);
}

export async function getCarsWhereBrandId(brandId) {
  brandId = Number(brandId);

  const cars = await getCars();

  if (!brandId) {
    return cars;
  }

  const brandFilterOptions = await getBrandFilterOptions(cars);
  const brand = brandFilterOptions[brandId];

  return cars.filter((car) => car.brand === brand);
}

export async function getBrandFilterOptions(cars = null) {
  if (!cars) {
    cars = await getCars();
  }

  return ["Wszystkie", ...new Set(cars.map((car) => car.brand))];
}

export async function getAccessories() {
  const accessories = await fetch("/api/accessories.json").then((res) =>
    res.json()
  );

  return accessories ?? [];
}

export async function getAccessoriesWhereIds(accessoriesIds) {
  accessoriesIds = accessoriesIds.map((accessoryId) => Number(accessoryId));

  const accessories = await getAccessories();

  return accessories.filter((accessory) =>
    accessoriesIds.includes(accessory.id)
  );
}
