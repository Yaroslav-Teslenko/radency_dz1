import actionApp from "./actions-app.js";

function addTDContent(textContent) {
  const td = document.createElement("td");
  td.textContent = textContent;
  return td;
}

function addTDBtn(btn, ttip = "") {
  const btnNew = document.createElement("button");
  btnNew.innerHTML = `<i class="material-icons">${btn}</i>`;
  btnNew.classList.add("btn-small", "btn", "tooltipped");
  btnNew.setAttribute("data-tooltip", ttip);

  const td = document.createElement("td");
  td.classList.add("td-btn");
  td.appendChild(btnNew);
  return td;
}

function renderDropCategories(setCategory = "Task") {
  const dSelect = document.querySelector(".categories-select");
  const fragment = document.createDocumentFragment();
  Object.values(window.objOfCategories).forEach((record, ind) => {
    const opt = document.createElement("option");
    opt.value = record.category;
    opt.textContent = record.category;
    if (record.category === setCategory) {
      opt.selected = true;
    }
    fragment.appendChild(opt);
  });
  while (dSelect.firstChild) {
    dSelect.removeChild(dSelect.firstChild);
  }
  dSelect.appendChild(fragment);
}
export function templateRecord({ id, name, created, category, content, active } = {}, ind) {
  const tr = document.createElement("tr");
  tr.setAttribute("data-record-id", id);
  tr.setAttribute("data-active", active);

  tr.appendChild(addTDContent(ind + 1));
  tr.appendChild(addTDContent(name));
  tr.appendChild(addTDContent(actionApp.dateFilter(created)));
  tr.appendChild(addTDContent(category));
  tr.appendChild(addTDContent(content));
  tr.appendChild(addTDContent(actionApp.getDateFromContext(content)));

  const arhBtn = addTDBtn("cloud_download", "no active");
  arhBtn.addEventListener("click", actionApp.onToggleArhived);
  tr.appendChild(arhBtn);

  const editBtn = addTDBtn("edit_in_new", "edit");
  editBtn.addEventListener("click", actionApp.onEditBtn);
  tr.appendChild(editBtn);

  const deleteBtn = addTDBtn("delete", "delete");
  deleteBtn.addEventListener("click", actionApp.onDeleteBtn);
  tr.appendChild(deleteBtn);
  return tr;
}
export function templateSummaryCategory({ category, all, arh } = {}, ind) {
  const tr = document.createElement("tr");

  tr.appendChild(addTDContent(category));
  tr.appendChild(addTDContent(all - arh));
  tr.appendChild(addTDContent(arh));

  return tr;
}
function renderToTable(recList, tabName) {
  if (!recList) {
    console.error("Передайте список !");
    return;
  }
  // console.log(recList);
  const table = document.querySelector(`.${tabName}`);
  const fragment = document.createDocumentFragment();
  let tr = {};
  Object.values(recList).forEach((record, ind) => {
    if (tabName === "main-table") {
      tr = templateRecord(record, ind);
    }
    if (tabName === "summary-table") {
      tr = templateSummaryCategory(record, ind);
    }

    fragment.appendChild(tr);
  });
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
  table.appendChild(fragment);
  //M.Tooltip.init(document.querySelectorAll(".tooltipped"));
}

//
export default { renderToTable, templateRecord, templateSummaryCategory, renderDropCategories };
