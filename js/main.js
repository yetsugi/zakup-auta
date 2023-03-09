import * as Api from "./api.js";

const $listView = document.querySelector("#list-view");
const $formView = document.querySelector("#form-view");
const $summaryView = document.querySelector("#summary-view");

const showListViewEvent = new Event("show-list-view");
const showFormViewEvent = new Event("show-form-view");
const showSummaryViewEvent = new Event("show-summary-view");

function showListView() {
  const $brandFilter = document.querySelector("#brand-filter");
  const $carList = document.querySelector("#car-list");

  function fillBrandFilter() {
    $brandFilter.replaceChildren();

    Api.getBrandFilterOptions().forEach((option) =>
      $brandFilter.add(new Option(option, option))
    );

    $brandFilter.options[0].defaultSelected = true;
  }

  function fillCarList(cars) {
    $carList.replaceChildren();

    cars.forEach((car) => {
      const $carListItem = document.createElement("li");

      $carListItem.dataset.carId = car.id;

      $carListItem.innerHTML = `
        <img src="${car.img}" alt="Zdjęcie ${car.nameStr}." />
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

  function handleBrandFilterChange(event) {
    const selectedIndex = event.target.selectedIndex;

    const cars = Api.getCarsWhereBrandId(selectedIndex);

    fillCarList(cars);

    sessionStorage.setItem("selected-brand-option", selectedIndex);
  }

  function handleCarListClick(event) {
    const $targetLi = event.target.closest("li");

    if ($targetLi) {
      hideView();

      sessionStorage.setItem("selected-car", $targetLi.dataset.carId);

      $formView.dispatchEvent(showFormViewEvent);
    }
  }

  function setEvents() {
    $brandFilter.addEventListener("change", handleBrandFilterChange);
    $carList.addEventListener("click", handleCarListClick);
  }

  function removeEvents() {
    $brandFilter.removeEventListener("change", handleBrandFilterChange);
    $carList.removeEventListener("click", handleCarListClick);
  }

  function hasPreviousSession() {
    return Boolean(sessionStorage.getItem("selected-brand-option"));
  }

  function restoreSession() {
    const selectedBrandOption = sessionStorage.getItem("selected-brand-option");

    $brandFilter.selectedIndex = selectedBrandOption;
  }

  function loadView() {
    fillBrandFilter();

    setEvents();

    if (hasPreviousSession()) {
      restoreSession();
    }

    $brandFilter.dispatchEvent(new Event("change"));

    $listView.classList.remove("hidden");
  }

  function hideView() {
    $listView.classList.add("hidden");

    removeEvents();
  }

  loadView();
}

function showFormView() {
  const $quitFormViewBtn = document.querySelector("#quit-form-view");

  const $form = document.querySelector("#form");
  const $accessories = document.querySelector("#accessories");
  const $payment = document.querySelector("#payment");
  const $carInfo = document.querySelector("#car-info");

  const $fullName = document.querySelector("#full-name");
  const $pickUpPlace = document.querySelector("#pick-up-place");
  const $pickUpDate = document.querySelector("#pick-up-date");

  function fillAccessories() {
    $accessories.replaceChildren();

    Api.getAccessories().forEach((accessory) => {
      const $accessoryElement = document.createElement("label");

      $accessoryElement.innerHTML = `
        <input type="checkbox" name="accessories" value="${accessory.id}" data-price="${accessory.price}" />
        <span>${accessory.nameStr}</span>
      `;

      $accessories.appendChild($accessoryElement);
    });
  }

  function initPickUpDate() {
    const date = new Date();

    date.setDate(date.getDate() + 1);
    $pickUpDate.setAttribute("min", date.toISOString().split("T")[0]);

    date.setDate(date.getDate() + 14);
    $pickUpDate.setAttribute("max", date.toISOString().split("T")[0]);
  }

  function setCar() {
    const selectedCarId = sessionStorage.getItem("selected-car");
    const car = Api.getCarById(selectedCarId);

    $carInfo.innerText = `${car.nameStr} - ${car.priceStr}`;
    $carInfo.dataset.price = car.price;

    const $carId = document.querySelector("#car-id");
    $carId.value = car.id;
  }

  function calculateTotalPrice() {
    const $selectedAccessories = [
      ...document.querySelectorAll('input[name="accessories"]'),
    ].filter((accessory) => accessory.checked);

    const totalPrice = [$carInfo, ...$selectedAccessories]
      .map(($element) => Number($element.dataset.price))
      .reduce((totalPrice, itemPrice) => totalPrice + itemPrice);

    const $totalPrice = document.querySelector("#total-price");
    $totalPrice.innerText = `${totalPrice} zł`;
  }

  function handleQuitFormViewBtnClick() {
    hideView();

    sessionStorage.removeItem("form-data");

    $listView.dispatchEvent(showListViewEvent);
  }

  function handlePaymentChange(event) {
    if (event.target.nodeName === "INPUT") {
      saveSession();
    }
  }

  function handleAccessoriesChange(event) {
    if (event.target.nodeName === "INPUT") {
      calculateTotalPrice();

      saveSession();
    }
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    $formView.classList.add("hidden");

    removeEvents();

    $summaryView.dispatchEvent(showSummaryViewEvent);
  }

  function setEvents() {
    $quitFormViewBtn.addEventListener("click", handleQuitFormViewBtnClick);

    $fullName.addEventListener("keyup", saveSession);
    $pickUpPlace.addEventListener("keyup", saveSession);

    $pickUpDate.addEventListener("change", saveSession);

    $payment.addEventListener("change", handlePaymentChange);

    $accessories.addEventListener("change", handleAccessoriesChange);

    $form.addEventListener("submit", handleFormSubmit);
  }

  function removeEvents() {
    $quitFormViewBtn.removeEventListener("click", handleQuitFormViewBtnClick);

    $fullName.removeEventListener("keyup", saveSession);
    $pickUpPlace.removeEventListener("keyup", saveSession);

    $pickUpDate.removeEventListener("change", saveSession);

    $payment.removeEventListener("change", handlePaymentChange);

    $accessories.removeEventListener("change", handleAccessoriesChange);

    $form.removeEventListener("click", handleFormSubmit);
  }

  function saveSession() {
    console.log("save");
    const formData = new FormData($form);
    const formDataObj = Object.fromEntries(formData.entries());

    formDataObj.accessories = formData.getAll("accessories");

    sessionStorage.setItem("form-data", JSON.stringify(formDataObj));
  }

  function hasPreviousSession() {
    return Boolean(sessionStorage.getItem("form-data"));
  }

  function restoreSession() {
    const formData = JSON.parse(sessionStorage.getItem("form-data"));
    const { payment, accessories, ...standardFormData } = formData;

    if (payment) {
      const $selectedPaymentRadio = document.querySelector(
        `#payment input[value="${payment}"]`
      );
      $selectedPaymentRadio.checked = true;
    }

    if (accessories) {
      accessories.forEach((accessory) => {
        const $selectedAccessory = document.querySelector(
          `#accessories input[value="${accessory}"]`
        );

        $selectedAccessory.checked = true;
      });
    }

    Object.entries(standardFormData).forEach((entry) => {
      console.log(entry);
      const input = document.querySelector(`#${entry[0]}`);
      input.value = entry[1];
    });
  }

  function loadView() {
    fillAccessories();

    initPickUpDate();

    setEvents();

    setCar();

    if (hasPreviousSession()) {
      restoreSession();
    }

    calculateTotalPrice();

    $formView.classList.remove("hidden");
  }

  function hideView() {
    $formView.classList.add("hidden");

    removeEvents();

    $form.reset();

    sessionStorage.removeItem("selected-car");
  }

  loadView();
}

function showSummaryView() {
  const $quitSummaryViewBtn = document.querySelector("#quit-summary-view");

  const $order = document.querySelector("#order");

  function handleQuitSummaryViewBtnClick() {
    hideView();

    $listView.dispatchEvent(showListViewEvent);
  }

  function setOrder() {
    $order.replaceChildren();

    const formData = JSON.parse(sessionStorage.getItem("form-data"));
    const car = Api.getCarById(formData["car-id"]);

    const $carImg = document.createElement("img");
    $carImg.setAttribute("src", car.img);
    $carImg.setAttribute("alt", `Zdjęcie ${car.nameStr}`);
    $order.appendChild($carImg);

    const $orderDetails = document.createElement("dl");
    $orderDetails.innerHTML = `
      <dt>Imię i nazwisko: </dt>
      <dd>${formData["full-name"]}</dd>
      <dt>Miejsce odbioru: </dt>
      <dd>${formData["pick-up-place"]}</dd>
      <dt>Data odbioru: </dt>
      <dd>${formData["pick-up-date"]}</dd>
      <dt>Forma finansowania: </dt>
      <dd>${formData["payment"] === "lease" ? "Leasing" : "Gotówka"}</dd>
      <dt>Auto: </dt>
      <dd>${car.nameStr} - ${car.priceStr}</dd>
    `;

    let accessories = [];
    if (formData["accessories"].length !== 0) {
      const $accessoriesDt = document.createElement("dt");
      $accessoriesDt.innerText = "Akcesoria: ";
      $orderDetails.appendChild($accessoriesDt);

      accessories = Api.getAccessoriesWhereIds(formData["accessories"]);
      accessories.forEach((accessory) => {
        const $accessoryDd = document.createElement("dd");

        $accessoryDd.innerText = accessory.nameStr;

        $orderDetails.appendChild($accessoryDd);
      });
    }

    const $totalPriceDt = document.createElement("dt");
    $totalPriceDt.innerText = "Razem: ";
    $orderDetails.appendChild($totalPriceDt);

    const $totalPriceDd = document.createElement("dd");
    $totalPriceDd.innerText = [car, ...accessories]
      .map((item) => item.price)
      .reduce((totalPrice, itemPrice) => totalPrice + itemPrice);
    $totalPriceDd.innerText += " zł";
    $orderDetails.appendChild($totalPriceDd);

    $order.appendChild($orderDetails);
  }

  function setEvents() {
    $quitSummaryViewBtn.addEventListener(
      "click",
      handleQuitSummaryViewBtnClick
    );
  }

  function removeEvents() {
    $quitSummaryViewBtn.removeEventListener(
      "click",
      handleQuitSummaryViewBtnClick
    );
  }

  function removeSessionData() {
    console.log("remove session");

    sessionStorage.removeItem("selected-car");
    sessionStorage.removeItem("form-data");
  }

  function loadView() {
    setEvents();

    setOrder();

    setTimeout(removeSessionData, 300);

    $summaryView.classList.remove("hidden");
  }

  function hideView() {
    $summaryView.classList.add("hidden");

    removeEvents();
  }

  loadView();
}

function loadApp() {
  $listView.addEventListener(showListViewEvent.type, showListView);
  $formView.addEventListener(showFormViewEvent.type, showFormView);
  $summaryView.addEventListener(showSummaryViewEvent.type, showSummaryView);

  if (sessionStorage.getItem("selected-car")) {
    $formView.dispatchEvent(showFormViewEvent);

    return;
  }

  $listView.dispatchEvent(showListViewEvent);
}

loadApp();
