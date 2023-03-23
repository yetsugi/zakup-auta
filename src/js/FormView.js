import * as Api from "./Api.js";

import { $listView, showListViewEvent } from "./ListView.js";
import { $summaryView, showSummaryViewEvent } from "./SummaryView.js";

export const $formView = document.querySelector("#form-view");

export const showFormViewEvent = new Event("show-form-view");

export function showFormView() {
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
