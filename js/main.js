import { cars, brands } from "./car.js";

function fillBrandFilter() {
  const $brandFilter = document.querySelector("#brand-filter");

  $brandFilter.add(new Option("Wszystkie", "Wszystkie", true));
  brands.forEach((brand) => {
    const option = new Option(brand, brand);

    $brandFilter.add(option);
  });
}

function fillCarList() {
  const $carList = document.querySelector("#car-list");

  cars.forEach((car) => {
    const $carListItem = document.createElement("li");

    $carListItem.innerHTML = `
      <car-li-content
        car-img="${car.img}"
        car-name="${car.nameStr}"
        car-year="${car.year}"
        car-engine-power="${car.enginePowerStr}"
        car-mileage="${car.mileageStr}"
        car-price="${car.priceStr}"
      ></car-li-content>
    `;

    $carList.appendChild($carListItem);
  });
}

fillBrandFilter();
fillCarList();
