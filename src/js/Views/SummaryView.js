import * as Api from "../Api.js";

import { $listView, showListViewEvent } from "./ListView.js";

export const $summaryView = document.querySelector("#summary-view");

export const showSummaryViewEvent = new Event("show-summary-view");

export function showSummaryView() {
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
