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
  const $addAccessoryBtn = document.querySelector("#add-accessory");
  const $removeAccessoryBtn = document.querySelector("#remove-accessory");

  const $form = document.querySelector("#form");
  const $availableAccessories = document.querySelector(
    "#available-accessories"
  );
  const $selectedAccessories = document.querySelector("#selected-accessories");

  function fillAvailableAccessories() {
    $availableAccessories.replaceChildren();

    Api.getAccessories().forEach((accessory) =>
      $availableAccessories.add(new Option(accessory.nameStr, accessory.id))
    );
  }

  function moveOptions($from, $to) {
    const $selectedOptions = [...$from.selectedOptions];

    $selectedOptions.forEach((option) => {
      $to.add(option);
      $from.remove(option.value);
    });
  }

  function handleQuitFormViewBtnClick() {
    hideView();

    sessionStorage.removeItem("selected-car");

    $listView.dispatchEvent(showListViewEvent);
  }

  function handleAddAccessoryBtnClick() {
    moveOptions($availableAccessories, $selectedAccessories);
  }

  function handleRemoveAccessoryBtnClick() {
    moveOptions($selectedAccessories, $availableAccessories);
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    $formView.classList.add("hidden");

    removeEvents();

    $summaryView.dispatchEvent(showSummaryViewEvent);
  }

  function setEvents() {
    $quitFormViewBtn.addEventListener("click", handleQuitFormViewBtnClick);

    $addAccessoryBtn.addEventListener("click", handleAddAccessoryBtnClick);

    $removeAccessoryBtn.addEventListener(
      "click",
      handleRemoveAccessoryBtnClick
    );

    $form.addEventListener("submit", handleFormSubmit);
  }

  function removeEvents() {
    $quitFormViewBtn.removeEventListener("click", handleQuitFormViewBtnClick);

    $addAccessoryBtn.removeEventListener("click", handleAddAccessoryBtnClick);

    $removeAccessoryBtn.removeEventListener(
      "click",
      handleRemoveAccessoryBtnClick
    );

    $form.removeEventListener("click", handleFormSubmit);
  }

  function loadView() {
    fillAvailableAccessories();

    setEvents();

    $formView.classList.remove("hidden");
  }

  function hideView() {
    $formView.classList.add("hidden");

    removeEvents();
  }

  loadView();
}

function showSummaryView() {
  const $quitSummaryViewBtn = document.querySelector("#quit-summary-view");

  function handleQuitSummaryViewBtnClick() {
    $summaryView.classList.add("hidden");

    removeEvents();

    $listView.dispatchEvent(showListViewEvent);
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

  function loadView() {
    setEvents();

    $summaryView.classList.remove("hidden");
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
