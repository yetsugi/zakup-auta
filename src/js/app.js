import "../css/app.css";

import { $listView, showListViewEvent, showListView } from "./ListView.js";
import { $formView, showFormViewEvent, showFormView } from "./FormView.js";
import {
  $summaryView,
  showSummaryViewEvent,
  showSummaryView,
} from "./SummaryView.js";

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
