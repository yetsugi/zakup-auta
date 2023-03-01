import { cars, brandFilterOptions } from "./car.js";

const $brandFilter = document.querySelector("#brand-filter");
const $carList = document.querySelector("#car-list");

function fillBrandFilter() {
  brandFilterOptions.forEach((option) =>
    $brandFilter.add(new Option(option, option))
  );

  $brandFilter.options[0].defaultSelected = true;
}

function fillCarList(carArr) {
  $carList.replaceChildren();

  carArr.forEach((car) => {
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

$brandFilter.addEventListener("change", (event) => {
  const currentlySelected = event.target.value;

  const carArr =
    currentlySelected === "Wszystkie"
      ? cars
      : cars.filter((car) => car.brand === currentlySelected);

  fillCarList(carArr);
});

fillBrandFilter();
fillCarList(cars);
