import CarInfo from "../components/car-info";
import InputField from "../components/input-field";
import { getAccessories, getCarById } from "../api";
import { currencyFormatter, nowAddDays } from "../helpers";

export default class FormView {
  $el;
  $form;
  $carInfo;
  $accessories;
  $totalPrice;

  constructor() {
    this.carId = sessionStorage.getItem("selected-car-id");

    this.render();
  }

  calculateTotalPrice() {
    const $selectedAccessories = [
      ...this.$form.querySelectorAll('input[name="accessories"]'),
    ].filter((accessory) => accessory.checked);

    const totalPrice = [this.$carInfo, ...$selectedAccessories]
      .map(($element) => Number($element.dataset.price))
      .reduce((totalPrice, itemPrice) => totalPrice + itemPrice);

    this.$totalPrice.innerText = currencyFormatter.format(totalPrice);
  }

  restoreSession() {
    const formData = JSON.parse(sessionStorage.getItem("form-data"));
    const { payment, accessories, ...standardFormData } = formData;

    if (payment) {
      const $paymentRadio = this.$form.querySelector(`#${payment}`);
      $paymentRadio.checked = true;
    }

    if (accessories) {
      accessories.forEach((accessory) => {
        const $accessory = this.$form.querySelector(
          `input[name="accessories"][value="${accessory}"]`
        );

        $accessory.checked = true;
      });
    }

    for (const [key, value] of Object.entries(standardFormData)) {
      console.log([key, value]);
      const input = this.$form.querySelector(`#${key}`);
      input.value = value;
    }
  }

  goToIndex = (e) => {
    e.preventDefault();

    sessionStorage.removeItem("selected-car-id");
    sessionStorage.removeItem("form-data");

    window.app.goTo("index");
  };

  submit = (e) => {
    e.preventDefault();

    console.log("submitted");
    sessionStorage.removeItem("selected-car-id");

    window.app.goTo("summary");
  };

  saveSession = (e) => {
    if (e.target.nodeName === "INPUT") {
      const formData = new FormData(this.$form);
      const formDataObj = Object.fromEntries(formData.entries());

      formDataObj.accessories = formData.getAll("accessories");

      sessionStorage.setItem("form-data", JSON.stringify(formDataObj));
    }
  };

  async renderCarInfo() {
    const car = await getCarById(this.carId);
    const carInfo = new CarInfo(car);

    this.$carInfo.appendChild(carInfo.$el);
    this.$carInfo.dataset.price = car.price;
  }

  async renderAccessories() {
    const accessories = await getAccessories();

    accessories.forEach((accessory) => {
      const accessoryField = new InputField(
        `${accessory.name} (${currencyFormatter.format(accessory.price)})`,
        accessory.name.toLowerCase().replaceAll(" ", "-"),
        {
          type: "checkbox",
          name: "accessories",
          value: accessory.id,
        }
      );

      const accessoryInput = accessoryField.$el.querySelector("input");
      accessoryInput.dataset.price = accessory.price;

      this.$accessories.appendChild(accessoryField.$el);
    });
  }

  async populate() {
    await this.renderCarInfo();
    await this.renderAccessories();

    if (sessionStorage.getItem("form-data")) {
      this.restoreSession();
    }

    this.calculateTotalPrice();
  }

  render() {
    this.$el = document.createElement("div");

    const $goBack = document.createElement("button");
    $goBack.innerText = "Powrót";

    const $heading = document.createElement("h1");
    $heading.innerText = "Zamówienie";

    this.$form = document.createElement("form");
    this.$form.noValidate = true;

    this.$carInfo = document.createElement("div");

    const $carIdInput = document.createElement("input");
    $carIdInput.id = "car-id";
    $carIdInput.name = $carIdInput.id;
    $carIdInput.type = "hidden";
    $carIdInput.value = this.carId;

    const $basicInfoFieldset = document.createElement("fieldset");
    const $basicInfoLegend = document.createElement("legend");
    $basicInfoLegend.innerText = "Podstawowe informacje";

    const fullNameField = new InputField("Imię i nazwisko", "full-name", {
      required: true,
      pattern: "\\w+\\s\\w+",
    });

    const pickUpPlaceField = new InputField(
      "Miejsce odbioru",
      "pick-up-place",
      {
        required: true,
      }
    );

    const pickUpDateField = new InputField("Data odbioru", "pick-up-date", {
      required: true,
      type: "date",
      min: nowAddDays(1),
      max: nowAddDays(15),
    });

    const $paymentMethodFieldset = document.createElement("fieldset");
    const $paymentMethodLegend = document.createElement("legend");
    $paymentMethodLegend.innerText = "Forma finansowania";

    const leasePaymentField = new InputField("Leasing", "lease", {
      required: true,
      type: "radio",
      value: "lease",
      name: "payment",
    });

    const cashPaymentField = new InputField("Gotówka", "cash", {
      required: true,
      type: "radio",
      value: "cash",
      name: "payment",
    });

    const $accessoriesFieldset = document.createElement("fieldset");
    const $accessoriesLegend = document.createElement("legend");
    $accessoriesLegend.innerText = "Akcesoria";

    this.$accessories = document.createElement("div");

    const $totalPriceParagraph = document.createElement("p");
    $totalPriceParagraph.innerText = "Razem: ";

    this.$totalPrice = document.createElement("span");

    const $submitBtn = document.createElement("button");
    $submitBtn.innerText = "Złóż zamówienie";

    $basicInfoFieldset.appendChild($basicInfoLegend);
    $basicInfoFieldset.appendChild(fullNameField.$el);
    $basicInfoFieldset.appendChild(pickUpPlaceField.$el);
    $basicInfoFieldset.appendChild(pickUpDateField.$el);

    $paymentMethodFieldset.appendChild($paymentMethodLegend);
    $paymentMethodFieldset.appendChild(leasePaymentField.$el);
    $paymentMethodFieldset.appendChild(cashPaymentField.$el);

    $accessoriesFieldset.appendChild($accessoriesLegend);
    $accessoriesFieldset.appendChild(this.$accessories);

    $totalPriceParagraph.appendChild(this.$totalPrice);

    this.$form.appendChild(this.$carInfo);
    this.$form.appendChild($carIdInput);
    this.$form.appendChild($basicInfoFieldset);
    this.$form.appendChild($paymentMethodFieldset);
    this.$form.appendChild($accessoriesFieldset);
    this.$form.appendChild($totalPriceParagraph);
    this.$form.appendChild($submitBtn);

    this.$el.appendChild($goBack);
    this.$el.appendChild($heading);
    this.$el.appendChild(this.$form);

    this.populate();

    $goBack.addEventListener("click", this.goToIndex);
    this.$accessories.addEventListener("change", () =>
      this.calculateTotalPrice()
    );
    this.$form.addEventListener("change", this.saveSession);
    this.$form.addEventListener("keyup", this.saveSession);
    this.$form.addEventListener("submit", this.submit);
  }
}
