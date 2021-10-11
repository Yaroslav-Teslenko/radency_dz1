import { categories } from "../data/categories.js";

import rendApp from "./render-app.js";

function dateFilter(value, format = "date") {
  const options = {};

  if (format.includes("date")) {
    options.day = "2-digit";
    options.month = "2-digit";
    options.year = "numeric";
  }

  const locale = "en-US";
  return new Intl.DateTimeFormat(locale, options).format(new Date(value));
}

function getDateFromContext(myString) {
  //Check pattern only
  let myRegexp = /\d{2}[-.\/]\d{2}(?:[-.\/]\d{2}(\d{2})?)?/gi;
  /*  let validDate =
    /(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])?|(?:(?:16|[2468][048]|[3579][26])00)?)))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))(\4)?(?:(?:1[6-9]|[2-9]\d)?\d{2})?$/gi; //Check the validity of the date */
  //Check the validity of the date
  let validDate =
    /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
  // let regArr = myRegexp.exec(myString);
  // TODO прояснить этот момент
  let regArr = myString.match(myRegexp);
  //console.log(regArr);
  try {
    let tmp = regArr.reduce((str, item) => {
      if (validDate.exec(item)) {
        str += item + "\n";
      }
      return str;
    }, "");
    return tmp;
  } catch (error) {
    //console.error(error.message);
  }
}
function getFilterData(isActive) {
  const tmp = Object.values(window.objOfRecords).filter((record) => {
    return record.active === isActive;
  });
  console.log(tmp);
  return tmp;
}
function summaryCategories() {
  let tmp = categories.reduce((acc, record, idx) => {
    acc[record.category] = { ...record, all: 0, arh: 0 };
    return acc;
  }, {});
  for (const key in window.objOfRecords) {
    const element = window.objOfRecords[key];
    tmp[element.category].all++;
    if (!element.active) {
      tmp[element.category].arh++;
    }
  }
  //console.log(tmp);
  return tmp;
}

function deleteRecord(id) {
  const { name } = objOfRecords[id];
  const isConfirm = confirm(`Точно вы хотите удалить задачу: ${name}`);
  if (!isConfirm) return isConfirm;
  delete objOfRecords[id];
  window.objOfCategories = summaryCategories();
  rendApp.renderToTable(getFilterData(document.querySelector(".check-arhived").checked), "main-table");
  rendApp.renderToTable(window.objOfCategories, "summary-table");
  return isConfirm;
}

function deleteRecordFromHtml(confirmed, el) {
  if (!confirmed) return;
  el.remove();
}

function onDeleteBtn({ target }) {
  const parent = target.closest("[data-record-id]");
  const id = parent.dataset.recordId;
  const confirmed = deleteRecord(id);
  deleteRecordFromHtml(confirmed, parent);
  summaryCategories();
}

function createRecord(name, category, content) {
  document.querySelector(".createBtn").addEventListener("click", onCreateBtn);
  const newRec = {
    id: `rec-${Math.random()}`,
    name,
    created: new Date(),
    category,
    content,
    active: true,
  };
  window.objOfRecords[newRec.id] = newRec;
  return { ...newRec };
}

function onCreateSave(e) {
  e.preventDefault();
  const form = document.forms["addRecord"];
  const name = form.elements["name"].value;
  const category = form.elements["category"].value;
  const content = form.elements["content"].value;
  // const active =  form.elements["name"].value;
  if (!name || !content) {
    alert("Please enter name and content");
    return;
  }

  createRecord(name, category, content);
  window.objOfCategories = summaryCategories();
  rendApp.renderToTable(getFilterData(document.querySelector(".check-arhived").checked), "main-table");
  rendApp.renderToTable(window.objOfCategories, "summary-table");

  form.reset();
}

function onCreateBtn() {
  document.querySelector(".createBtn").classList.add("hide");
  rendApp.renderDropCategories();
  document.querySelector(".form-section").classList.remove("hide");
  document.querySelector(".saveBtn").removeEventListener("click", onEditSave);
  document.querySelector(".saveBtn").addEventListener("click", onCreateSave);
}

function onEditBtn({ target }) {
  //document.forms["addRecord"].reset();
  document.querySelector(".createBtn").classList.add("hide");
  document.querySelector(".form-section").classList.remove("hide");
  document.querySelector(".saveBtn").removeEventListener("click", onCreateSave);
  document.querySelector(".saveBtn").addEventListener("click", onEditSave);

  const id = target.closest("[data-record-id]").dataset.recordId;
  const form = document.forms["addRecord"];
  form.setAttribute("data-record-id", id);
  const obj = window.objOfRecords[id];
  form.elements["name"].value = obj.name;
  rendApp.renderDropCategories(obj.category);
  form.elements["content"].value = obj.content;
}

function onEditSave(e) {
  e.preventDefault();
  const form = document.forms["addRecord"];
  const id = form.getAttribute("data-record-id");
  window.objOfRecords[id].name = form.elements["name"].value;
  window.objOfRecords[id].content = form.elements["content"].value;
  window.objOfRecords[id].category = form.elements["category"].value;
  window.objOfCategories = summaryCategories();
  rendApp.renderToTable(getFilterData(document.querySelector(".check-arhived").checked), "main-table");
  rendApp.renderToTable(window.objOfCategories, "summary-table");

  document.querySelector(".createBtn").classList.remove("hide");
  document.querySelector(".form-section").classList.add("hide");

  form.reset();
}
function onCloseBtn() {
  document.forms["addRecord"].reset();
  document.querySelector(".createBtn").classList.remove("hide");
  document.querySelector(".form-section").classList.add("hide");
}
function onCheckArhived({ target }) {
  rendApp.renderToTable(getFilterData(target.checked), "main-table");
}
function onToggleArhived({ target }) {
  const id = target.closest("[data-record-id]").dataset.recordId;

  window.objOfRecords[id].active = !window.objOfRecords[id].active;
  window.objOfCategories = summaryCategories();
  rendApp.renderToTable(getFilterData(document.querySelector(".check-arhived").checked), "main-table");
  rendApp.renderToTable(window.objOfCategories, "summary-table");
}
export default {
  getFilterData,
  onDeleteBtn,
  onCreateSave,
  summaryCategories,
  onCreateBtn,
  onCloseBtn,
  onEditSave,
  onEditBtn,
  dateFilter,
  getDateFromContext,
  onCheckArhived,
  onToggleArhived,
};
