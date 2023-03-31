import CarInfo from "../components/car-info";
import { getAccessoriesWhereIds, getCarById } from "../api";
import { currencyFormatter } from "../helpers";

export default class SummaryView {
  $el;
  $carInfo;
  $basicInfo;
  $paymentMethod;
  $accessories;
  $totalPrice;

  constructor() {
    this.summaryData = JSON.parse(sessionStorage.getItem("form-data"));

    this.render();
  }

  calculateTotalPrice() {
    const totalPrice = [...this.$el.querySelectorAll("[data-price]")]
      .map(($element) => Number($element.dataset.price))
      .reduce((totalPrice, itemPrice) => totalPrice + itemPrice);

    this.$totalPrice.innerText = currencyFormatter.format(totalPrice);
  }

  goToIndex = (e) => {
    e.preventDefault();

    sessionStorage.clear();

    window.app.goTo("index");
  };

  async renderCarInfo() {
    const car = await getCarById(this.summaryData["car-id"]);
    const carInfo = new CarInfo(car);

    this.$carInfo.appendChild(carInfo.$el);
    this.$carInfo.dataset.price = car.price;
  }

  async renderBasicInfo() {
    const $basicInfoDl = document.createElement("dl");

    const $fullNameDt = document.createElement("dt");
    $fullNameDt.innerText = "Imię i nazwisko";

    const $fullNameDd = document.createElement("dd");
    $fullNameDd.innerText = this.summaryData["full-name"];

    const $pickUpPlaceDt = document.createElement("dt");
    $pickUpPlaceDt.innerText = "Miejsce odbioru";

    const $pickUpPlaceDd = document.createElement("dd");
    $pickUpPlaceDd.innerText = this.summaryData["pick-up-place"];

    const $pickUpDateDt = document.createElement("dt");
    $pickUpDateDt.innerText = "Data odbioru";

    const $pickUpDateDd = document.createElement("dd");
    $pickUpDateDd.innerText = this.summaryData["pick-up-date"];

    $basicInfoDl.appendChild($fullNameDt);
    $basicInfoDl.appendChild($fullNameDd);
    $basicInfoDl.appendChild($pickUpPlaceDt);
    $basicInfoDl.appendChild($pickUpPlaceDd);
    $basicInfoDl.appendChild($pickUpDateDt);
    $basicInfoDl.appendChild($pickUpDateDd);

    this.$basicInfo.appendChild($basicInfoDl);
  }

  async renderPaymentMethod() {
    const $paymentMethodP = document.createElement("p");
    $paymentMethodP.innerText =
      this.summaryData["payment"] === "lease" ? "Leasing" : "Gotówka";

    this.$paymentMethod.appendChild($paymentMethodP);
  }

  async renderAccessories() {
    if (this.summaryData.accessories.length === 0) {
      const $noAccessories = document.createElement("p");
      $noAccessories.innerText = "Brak";
    }

    const accessories = await getAccessoriesWhereIds(
      this.summaryData.accessories
    );
    const $accessoriesUl = document.createElement("ul");

    accessories.forEach((accessory) => {
      const $accessory = document.createElement("li");
      $accessory.innerText = `${accessory.name} (${currencyFormatter.format(
        accessory.price
      )})`;
      $accessory.dataset.price = accessory.price;

      $accessoriesUl.appendChild($accessory);
    });

    this.$accessories.appendChild($accessoriesUl);
  }

  async populate() {
    await this.renderCarInfo();
    await this.renderBasicInfo();
    await this.renderPaymentMethod();
    await this.renderAccessories();

    this.calculateTotalPrice();
  }

  render() {
    this.$el = document.createElement("div");

    const $heading = document.createElement("h1");
    $heading.innerText = "Podsumowanie";

    const $carInfoHeading = document.createElement("h2");
    $carInfoHeading.innerText = "Samochód";

    this.$carInfo = document.createElement("div");

    const $basicInfoHeading = document.createElement("h2");
    $basicInfoHeading.innerText = "Podstawowe dane";

    this.$basicInfo = document.createElement("div");

    const $paymentMethodHeading = document.createElement("h2");
    $paymentMethodHeading.innerText = "Forma finansowania";

    this.$paymentMethod = document.createElement("div");

    const $accessoriesHeading = document.createElement("h2");
    $accessoriesHeading.innerText = "Akcesoria";

    this.$accessories = document.createElement("div");

    const $totalPriceParagraph = document.createElement("p");
    $totalPriceParagraph.innerText = "Razem: ";

    this.$totalPrice = document.createElement("span");

    const $goBackToIndex = document.createElement("button");
    $goBackToIndex.innerText = "Powrót do listy";

    $totalPriceParagraph.appendChild(this.$totalPrice);

    this.$el.appendChild($heading);
    this.$el.appendChild($carInfoHeading);
    this.$el.appendChild(this.$carInfo);
    this.$el.appendChild($basicInfoHeading);
    this.$el.appendChild(this.$basicInfo);
    this.$el.appendChild($paymentMethodHeading);
    this.$el.appendChild(this.$paymentMethod);
    this.$el.appendChild($accessoriesHeading);
    this.$el.appendChild(this.$accessories);
    this.$el.appendChild($totalPriceParagraph);
    this.$el.appendChild($goBackToIndex);

    this.populate();

    $goBackToIndex.addEventListener("click", this.goToIndex);
  }
}
