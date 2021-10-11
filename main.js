// import { renderToTable } from "./js/render-app.js";
import rendApp from "./js/render-app.js";
import actionApp from "./js/actions-app.js";
import { records } from "../data/data.js";

window.objOfRecords = records.reduce((acc, record, idx) => {
  acc[record.id] = { ...record, idx };
  return acc;
}, {});

window.objOfCategories = {};

(function () {
  window.objOfCategories = actionApp.summaryCategories();
  document.querySelector(".check-arhived").addEventListener("change", actionApp.onCheckArhived);
  document.querySelector(".createBtn").addEventListener("click", actionApp.onCreateBtn);
  document.querySelector(".closeBtn").addEventListener("click", actionApp.onCloseBtn);

  document.forms["addRecord"].addEventListener("submit", actionApp.onFormSubmitHandler);
  rendApp.renderToTable(actionApp.getFilterData(true), "main-table");
  rendApp.renderToTable(window.objOfCategories, "summary-table");
})();
