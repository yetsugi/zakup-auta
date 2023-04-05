import CarInfo from "../components/car-info";
import InputField from "../components/input-field";
import { getAccessories, getCarById } from "../api";
import { currencyFormatter, nowAddDays } from "../helpers";

export default class FormView {
  $el;
  $form;
  $carInfo;
  $paymentMethodErrorMsg;
  $accessoriesFieldset;
  $totalPrice;

  fullNameField;
  pickUpPlaceField;
  pickUpDateField;
  leasePaymentField;
  cashPaymentField;

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

    let date = standardFormData["pick-up-date"];

    if (date) {
      date = date.split("-");
      date = new Date(`${date[2]}-${date[1]}-${date[0]}`);
      this.pickUpDateField.$input._flatpickr.setDate(date);
    }
  }

  makeFieldset(legend) {
    const $fieldset = document.createElement("fieldset");
    $fieldset.classList.add("form-view__fieldset");

    const $legend = document.createElement("legend");
    $legend.classList.add("form-view__legend");
    $legend.innerText = legend;

    $fieldset.append($legend);

    return $fieldset;
  }

  showErrors() {
    if (!this.fullNameField.$input.checkValidity()) {
      if (this.fullNameField.$input.validity.valueMissing) {
        this.fullNameField.$errorMsg.innerText = "To pole musi być wypełnione";
      }

      if (this.fullNameField.$input.validity.patternMismatch) {
        this.fullNameField.$errorMsg.innerText =
          "Imię i nazwisko musi być oddzielone spacją";
      }

      this.fullNameField.$input.classList.add("input-field__input--invalid");

      this.fullNameField.$errorMsg.classList.add(
        "input-field__error-msg--active"
      );
    }

    if (!this.pickUpPlaceField.$input.checkValidity()) {
      if (this.pickUpPlaceField.$input.validity.valueMissing) {
        this.pickUpPlaceField.$errorMsg.innerText =
          "To pole musi być wypełnione";
      }

      this.pickUpPlaceField.$input.classList.add("input-field__input--invalid");

      this.pickUpPlaceField.$errorMsg.classList.add(
        "input-field__error-msg--active"
      );
    }

    if (!this.pickUpDateField.$input.value) {
      this.pickUpDateField.$errorMsg.innerText = "To pole musi być wypełnione";

      this.pickUpDateField.$input.classList.add("input-field__input--invalid");

      this.pickUpDateField.$errorMsg.classList.add(
        "input-field__error-msg--active"
      );
    }

    if (!this.leasePaymentField.$input.checkValidity()) {
      if (this.leasePaymentField.$input.validity.valueMissing) {
        this.$paymentMethodErrorMsg.innerText = "Należy wybrać jedną z opcji";
      }

      this.leasePaymentField.$input.classList.add(
        "checkable-field__input--invalid"
      );

      this.leasePaymentField.$el.classList.add("checkable-field--invalid");

      this.cashPaymentField.$input.classList.add(
        "checkable-field__input--invalid"
      );

      this.cashPaymentField.$el.classList.add("checkable-field--invalid");

      this.$paymentMethodErrorMsg.classList.add(
        "input-field__error-msg--active"
      );
    }
  }

  removeInvalidStyles() {
    this.fullNameField.$input.classList.remove("input-field__input--invalid");

    this.fullNameField.$errorMsg.classList.remove(
      "input-field__error-msg--active"
    );

    this.pickUpPlaceField.$input.classList.remove(
      "input-field__input--invalid"
    );

    this.pickUpPlaceField.$errorMsg.classList.remove(
      "input-field__error-msg--active"
    );

    this.pickUpDateField.$input.classList.remove("input-field__input--invalid");

    this.pickUpDateField.$errorMsg.classList.remove(
      "input-field__error-msg--active"
    );

    this.leasePaymentField.$input.classList.remove(
      "checkable-field__input--invalid"
    );

    this.leasePaymentField.$el.classList.remove("checkable-field--invalid");

    this.cashPaymentField.$input.classList.remove(
      "checkable-field__input--invalid"
    );

    this.cashPaymentField.$el.classList.remove("checkable-field--invalid");

    this.$paymentMethodErrorMsg.classList.remove(
      "input-field__error-msg--active"
    );
  }

  goToIndex = (e) => {
    e.preventDefault();

    sessionStorage.removeItem("selected-car-id");
    sessionStorage.removeItem("form-data");

    window.app.goTo("index");
  };

  submit = (e) => {
    e.preventDefault();

    this.removeInvalidStyles();

    if (!this.$form.checkValidity() || !this.pickUpDateField.$input.value) {
      this.showErrors();
      return;
    }

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

    this.$carInfo.append(carInfo.$el);
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

      this.$accessoriesFieldset.append(accessoryField.$el);
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
    this.$el.classList.add("form-view");

    const $icon = document.createElement("i");
    $icon.classList.add("las", "la-arrow-left");

    const $goBack = document.createElement("button");
    $goBack.classList.add("nav-btn");
    $goBack.append($icon, " Powrót");

    const $heading = document.createElement("h1");
    $heading.classList.add("form-view__heading");
    $heading.innerText = "Zamówienie";

    this.$form = document.createElement("form");
    this.$form.classList.add("form-view__form");
    this.$form.noValidate = true;

    this.$carInfo = document.createElement("div");

    const $carIdInput = document.createElement("input");
    $carIdInput.id = "car-id";
    $carIdInput.name = $carIdInput.id;
    $carIdInput.type = "hidden";
    $carIdInput.value = this.carId;

    const $card = document.createElement("div");
    $card.classList.add("card");

    const $container = document.createElement("div");
    $container.classList.add("form-view__container");

    const $basicInfoFieldset = this.makeFieldset("Podstawowe informacje");

    this.fullNameField = new InputField("Imię i nazwisko", "full-name", {
      placeholder: "Podaj imię i nazwisko",
      required: true,
      pattern: "[a-zą-żA-ZĄ-Ż]+\\s[a-zą-żA-ZĄ-Ż]+",
    });

    this.pickUpPlaceField = new InputField("Miejsce odbioru", "pick-up-place", {
      placeholder: "Podaj miejsce odbioru",
      required: true,
    });

    this.pickUpDateField = new InputField("Data odbioru", "pick-up-date", {
      required: true,
      type: "date",
      min: nowAddDays(1),
      max: nowAddDays(15),
    });

    const $paymentMethodFieldset = this.makeFieldset("Forma finansowania");

    this.$paymentMethodErrorMsg = document.createElement("p");
    this.$paymentMethodErrorMsg.classList.add("input-field__error-msg");

    this.leasePaymentField = new InputField("Leasing", "lease", {
      required: true,
      type: "radio",
      value: "lease",
      name: "payment",
    });

    this.cashPaymentField = new InputField("Gotówka", "cash", {
      required: true,
      type: "radio",
      value: "cash",
      name: "payment",
    });

    this.$accessoriesFieldset = this.makeFieldset("Akcesoria");

    const $totalPriceParagraph = document.createElement("p");
    $totalPriceParagraph.classList.add("form-view__total-price");

    const $totalPriceLabel = document.createElement("span");
    $totalPriceLabel.innerText = "Razem: ";

    this.$totalPrice = document.createElement("span");

    const $submitBtn = document.createElement("button");
    $submitBtn.classList.add("btn");
    $submitBtn.innerText = "Złóż zamówienie";

    $basicInfoFieldset.append(
      this.fullNameField.$el,
      this.pickUpPlaceField.$el,
      this.pickUpDateField.$el
    );

    $paymentMethodFieldset.append(
      this.$paymentMethodErrorMsg,
      this.leasePaymentField.$el,
      this.cashPaymentField.$el
    );

    $totalPriceParagraph.append($totalPriceLabel, this.$totalPrice);

    $container.append(
      $basicInfoFieldset,
      $paymentMethodFieldset,
      this.$accessoriesFieldset,
      $totalPriceParagraph,
      $submitBtn
    );

    $card.append($container);

    this.$form.append(this.$carInfo, $carIdInput, $card);

    this.$el.append($goBack, $heading, this.$form);

    this.populate();

    $goBack.addEventListener("click", this.goToIndex);
    this.$accessoriesFieldset.addEventListener("change", () =>
      this.calculateTotalPrice()
    );
    this.$form.addEventListener("change", this.saveSession);
    this.$form.addEventListener("keyup", this.saveSession);
    this.$form.addEventListener("submit", this.submit);
  }
}
