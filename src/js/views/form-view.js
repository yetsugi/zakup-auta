import { getCarById } from "../Api";
import CarInfo from "../components/car-info";
import InputField from "../components/input-field";

export default class FormView {
  $el;

  constructor() {
    this.render();
  }

  async getSelectedCar() {
    const selectedCarId = sessionStorage.getItem("selected-car");
    const car = await getCarById(selectedCarId);

    return car;
  }

  async renderForm() {
    const $form = document.createElement("form");
    // novalidate
    const carInfo = new CarInfo(await this.getSelectedCar());

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

    //     <input type="hidden" name="car-id" id="car-id" />

    //   <fieldset>
    //     <legend>Akcesoria</legend>

    //     <div id="accessories"></div>
    //   </fieldset>

    //   <p>Razem: <span id="total-price"></span></p>

    //   <button type="submit">Zakup</button>

    const $submitBtn = document.createElement("button");
    $submitBtn.innerText = "Zakup";

    $paymentMethodFieldset.appendChild($paymentMethodLegend);
    $paymentMethodFieldset.appendChild(leasePaymentField.$el);
    $paymentMethodFieldset.appendChild(cashPaymentField.$el);

    $form.appendChild(carInfo.$el);
    $form.appendChild(fullNameField.$el);
    $form.appendChild(pickUpPlaceField.$el);
    $form.appendChild(pickUpDateField.$el);
    $form.appendChild($paymentMethodFieldset);
    $form.appendChild($submitBtn);

    this.$el.appendChild($form);
  }

  render() {
    this.$el = document.createElement("div");

    const $goBack = document.createElement("button");
    $goBack.innerText = "Powrót";

    const $heading = document.createElement("h1");
    $heading.innerText = "Zamówienie";

    this.$el.appendChild($goBack);
    this.$el.appendChild($heading);

    this.renderForm();
  }
}
