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

    if (!this.summaryData) {
      throw new Error("Cannot construct view");
    }

    this.render();

    setTimeout(this.fadeIn);
  }

  makeSection(title) {
    const $section = document.createElement("section");

    const $heading = document.createElement("h2");
    $heading.classList.add("summary-view__subheading");
    $heading.innerText = title;

    $section.append($heading);

    return $section;
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

    window.App.goTo("index");
  };

  async renderCarInfo() {
    const car = await getCarById(this.summaryData["car-id"]);
    const carInfo = new CarInfo(car);

    this.$carInfo.append(carInfo.$el);
    this.$carInfo.dataset.price = car.price;
  }

  async renderBasicInfo() {
    const $basicInfoDl = document.createElement("dl");
    $basicInfoDl.classList.add("summary-view__dl");

    const $fullNameDt = document.createElement("dt");
    $fullNameDt.innerText = "Imię i nazwisko";

    const $fullNameDd = document.createElement("dd");
    $fullNameDd.classList.add("summary-view__dd");
    $fullNameDd.innerText = this.summaryData["full-name"];

    const $pickUpPlaceDt = document.createElement("dt");
    $pickUpPlaceDt.innerText = "Miejsce odbioru";

    const $pickUpPlaceDd = document.createElement("dd");
    $pickUpPlaceDd.classList.add("summary-view__dd");
    $pickUpPlaceDd.innerText = this.summaryData["pick-up-place"];

    const $pickUpDateDt = document.createElement("dt");
    $pickUpDateDt.innerText = "Data odbioru";

    const $pickUpDateDd = document.createElement("dd");
    $pickUpDateDd.classList.add("summary-view__dd");
    $pickUpDateDd.innerText = this.summaryData["pick-up-date"];

    $basicInfoDl.append(
      $fullNameDt,
      $fullNameDd,
      $pickUpPlaceDt,
      $pickUpPlaceDd,
      $pickUpDateDt,
      $pickUpDateDd
    );

    this.$basicInfo.append($basicInfoDl);
  }

  async renderPaymentMethod() {
    const $paymentMethodP = document.createElement("p");
    $paymentMethodP.classList.add("summary-view__p");
    $paymentMethodP.innerText =
      this.summaryData["payment"] === "lease" ? "Leasing" : "Gotówka";

    this.$paymentMethod.append($paymentMethodP);
  }

  async renderAccessories() {
    if (this.summaryData.accessories.length === 0) {
      const $noAccessories = document.createElement("p");
      $noAccessories.classList.add("summary-view__p");
      $noAccessories.innerText = "Brak";

      this.$accessories.append($noAccessories);

      return;
    }

    const accessories = await getAccessoriesWhereIds(
      this.summaryData.accessories
    );
    const $accessoriesDl = document.createElement("dl");
    $accessoriesDl.classList.add("summary-view__dl");

    accessories.forEach((accessory) => {
      const $accessoryDt = document.createElement("dt");
      $accessoryDt.innerText = accessory.name;
      $accessoryDt.dataset.price = accessory.price;

      const $accessoryDd = document.createElement("dd");
      $accessoryDd.classList.add("summary-view__dd");
      $accessoryDd.innerText = currencyFormatter.format(accessory.price);

      $accessoriesDl.append($accessoryDt, $accessoryDd);
    });

    this.$accessories.append($accessoriesDl);
  }

  async populate() {
    await this.renderCarInfo();
    await this.renderBasicInfo();
    await this.renderPaymentMethod();
    await this.renderAccessories();

    this.calculateTotalPrice();
  }

  fadeIn = () => this.$el.classList.add("summary-view--fade-in");

  render() {
    this.$el = document.createElement("div");
    this.$el.classList.add("summary-view");

    const $heading = document.createElement("h1");
    $heading.classList.add("summary-view__heading");
    $heading.innerText = "Podsumowanie";

    this.$carInfo = document.createElement("div");

    const $card = document.createElement("div");
    $card.classList.add("card", "summary-view__container");

    this.$basicInfo = this.makeSection("Podstawowe dane");

    this.$paymentMethod = this.makeSection("Forma finansowania");

    this.$accessories = this.makeSection("Akcesoria");

    const $totalPriceParagraph = document.createElement("p");
    $totalPriceParagraph.classList.add("summary-view__total-price");
    $totalPriceParagraph.innerText = "Razem: ";

    this.$totalPrice = document.createElement("span");

    const $goBackToIndex = document.createElement("button");
    $goBackToIndex.classList.add("btn");
    $goBackToIndex.innerText = "Powrót do listy";

    $totalPriceParagraph.append(this.$totalPrice);

    $card.append(
      this.$basicInfo,
      this.$paymentMethod,
      this.$accessories,
      $totalPriceParagraph,
      $goBackToIndex
    );

    this.$el.append($heading, this.$carInfo, $card);

    this.populate();

    $goBackToIndex.addEventListener("click", this.goToIndex);
  }
}
