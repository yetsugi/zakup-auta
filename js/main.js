import { cars } from "./car.js";

const $brandFilter = document.querySelector("#brand-filter");
const $carList = document.querySelector("#car-list");

const brandFilterOptions = [
  "Wszystkie",
  ...new Set(cars.map((car) => car.brand)),
];

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
      <img src="${car.img}" alt="${car.nameStr} photo." />
      <h2>${car.nameStr}</h2>
      <dl>
        <dt>Rocznik:</dt>
        <dd>${car.year}</dd>
        <dt>Moc:</dt>
        <dd>${car.enginePowerStr}</dd>
        <dt>Przebieg:</dt>
        <dd>${car.mileageStr}</dd>
        <dt>Cena:</dt>
        <dd>${car.priceStr}</dd>
      </dl>
    `;

    $carList.appendChild($carListItem);
  });
}

$brandFilter.addEventListener("change", (event) => {
  const selectedIndex = event.target.selectedIndex;

  let carArr = cars;
  if (selectedIndex !== 0) {
    carArr = carArr.filter(
      (car) => car.brand === brandFilterOptions[selectedIndex]
    );
  }

  fillCarList(carArr);
});

fillBrandFilter();
fillCarList(cars);
