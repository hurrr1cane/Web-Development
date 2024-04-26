window.onload = async function () {
  if (navigator.serviceWorker) {
    try {
      await navigator.serviceWorker.register("../Scripts/serviceWorker.js");
    } catch (error) {
      console.log("Can't register serviceWorker");
    }
  }
};

var isEditNow = false;
var globalStudentRow = null;

//Add student event listener
$(".table-add-student").on("click", function () {
  console.log("Add student clicked");
  let studentDialog = document.querySelector(".student-dialog");
  studentDialog.showModal();
});

$(".student-dialog-close-button").on("click", function () {
  let studentDialog = document.querySelector(".student-dialog");
  // Clear the input fields
  let studentGroupInput = document.querySelector("#student-group");
  let studentNameInput = document.querySelector("#student-name");
  let studentSurnameInput = document.querySelector("#student-surname");
  let studentGenderInput = document.querySelector("#student-gender");
  let studentBirthdayInput = document.querySelector("#student-birthday");

  studentGroupInput.value = "";
  studentNameInput.value = "";
  studentSurnameInput.value = "";
  studentGenderInput.value = "Male";
  studentBirthdayInput.value = "";

  let dialogHeading = document.querySelector(".student-dialog-heading");
  dialogHeading.textContent = "Add student";

  studentDialog.close();
});

$(".student-options-delete").on("click", function () {
  deleteDialogFunction(this);
});

function deleteDialogFunction(value) {
  let deleteDialog = document.querySelector(".delete-student-dialog");
  deleteDialog.showModal();

  let studentRow = value.parentElement.parentElement.parentElement;
  let deleteButton = document.querySelector(".delete-student-dialog-delete");
  deleteButton.addEventListener("click", function () {
    studentRow.remove();
    deleteDialog.close();
  });
}

$(".student-options-edit").on("click", function (event) {
  //console.log(event.target.parentElement.parentElement.parentElement);
  let studentDialog = document.querySelector(".student-dialog");
  studentDialog.showModal();

  //console.log(this.parentElement.parentElement.parentElement);
  studentEditFunction(this.parentElement.parentElement.parentElement);
});

function fillIdField() {
  let studentId = document.getElementById("student-id");
  let id = Math.floor(Math.random() * 1000000);
  studentId.value = id;
}

function studentEditFunction(studentRow) {
  isEditNow = true;

  let windowTitle = document.querySelector(".student-dialog-heading");
  windowTitle.textContent = "Edit student";

  fillIdField();

  let studentGroupInput = document.querySelector("#student-group");
  let studentNameInput = document.querySelector("#student-name");
  let studentSurnameInput = document.querySelector("#student-surname");
  let studentGenderInput = document.querySelector("#student-gender");
  let studentBirthdayInput = document.querySelector("#student-birthday");

  let studentGroup = studentRow.children[1].textContent;
  let studentName = studentRow.children[2].textContent.split(" ")[1];
  let studentSurname = studentRow.children[2].textContent.split(" ")[0];
  let studentGender = studentRow.children[3].textContent;
  let studentBirthday = studentRow.children[4].textContent
    .split(".")
    .reverse()
    .join("-");

  studentGroupInput.value = studentGroup;
  studentNameInput.value = studentName;
  studentSurnameInput.value = studentSurname;
  studentGenderInput.value = studentGender;
  studentBirthdayInput.value = studentBirthday;

  // Save the row to a global variable
  globalStudentRow = studentRow;
}

$(".student-dialog-save").on("click", function () {
  if (isEditNow) {
    if (validateStudentInput()) {
      saveStudentEdit(globalStudentRow);
      //sendAjax();
      isEditNow = false;
    }
  } else {
    if (validateStudentInput()) {
      addStudent();
      //sendAjax();
    }
  }
});

function validateStudentInput() {
  let isValid = true;

  let studentGroupInput = document.querySelector("#student-group");
  let studentNameInput = document.querySelector("#student-name");
  let studentSurnameInput = document.querySelector("#student-surname");
  let studentBirthdayInput = document.querySelector("#student-birthday");

  let studentGroup = studentGroupInput.value;
  let studentName = studentNameInput.value;
  let studentSurname = studentSurnameInput.value;
  let studentBirthday = studentBirthdayInput.value;

  let studentGroupError = document.querySelector("#group-error");
  let studentNameError = document.querySelector("#name-error");
  let studentSurnameError = document.querySelector("#surname-error");
  let studentBirthdayError = document.querySelector("#birthday-error");

  if (!/^[A-Z\d]+-[A-Z\d]+$/.test(studentGroup)) {
    // Group format is invalid
    // Handle the error or display an error message
    //Display the studentGroupError.
    studentGroupError.style.display = "block";
    isValid = false;
  } else {
    studentGroupError.style.display = "none";
  }

  if (!/^[A-Z][a-z]+$/.test(studentName)) {
    // Name format is invalid
    // Handle the error or display an error message
    //Display the studentNameError.
    studentNameError.style.display = "block";
    isValid = false;
  } else {
    studentNameError.style.display = "none";
  }

  if (!/^[A-Z][a-z]+$/.test(studentSurname)) {
    // Surname format is invalid
    // Handle the error or display an error message
    //Display the studentSurnameError.
    studentSurnameError.style.display = "block";
    isValid = false;
  } else {
    studentSurnameError.style.display = "none";
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(studentBirthday)) {
    // Birthday format is invalid
    // Handle the error or display an error message
    //Display the studentBirthdayError.
    studentBirthdayError.style.display = "block";
    isValid = false;
  } else {
    studentBirthdayError.style.display = "none";
  }

  return isValid;
}

function saveStudentEdit(studentRow) {
  let studentGroupInput = document.querySelector("#student-group");
  let studentGroup = studentGroupInput.value;

  let studentNameInput = document.querySelector("#student-name");
  let studentName = studentNameInput.value;

  let studentSurnameInput = document.querySelector("#student-surname");
  let studentSurname = studentSurnameInput.value;

  let studentGenderInput = document.querySelector("#student-gender");
  let studentGender = studentGenderInput.value;

  let studentBirthdayInput = document.querySelector("#student-birthday");
  let studentBirthday = studentBirthdayInput.value;

  // Format the birthday as dd.mm.yyyy
  let formattedBirthday = studentBirthday.split("-").reverse().join(".");

  console.log(studentRow);

  sendAjax();

  studentRow.children[1].textContent = studentGroup;
  studentRow.children[2].textContent = `${studentSurname} ${studentName}`;
  studentRow.children[3].textContent = studentGender;
  studentRow.children[4].textContent = formattedBirthday;

  let studentDialog = document.querySelector(".student-dialog");
  studentDialog.close();

  let studentHeading = document.querySelector(".student-dialog-heading");
  studentHeading.textContent = "Add student";

  /* Remove eveerything from input fields */
  studentGroupInput.value = "";
  studentNameInput.value = "";
  studentSurnameInput.value = "";
  studentGenderInput.value = "Male";
  studentBirthdayInput.value = "";
}

function sendAjax() {
  let id = document.querySelector("#student-id").value;
  let group = document.querySelector("#student-group").value;
  let name = document.querySelector("#student-name").value;
  let surname = document.querySelector("#student-surname").value;
  let gender = document.querySelector("#student-gender").value;
  let birthday = document.querySelector("#student-birthday").value;

  try {
    new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Student data:", {
      id: id,
      group: group,
      name: name,
      surname: surname,
      gender: gender,
      birthday: birthday,
    });
    console.log("Data updated successfully");
  } catch (error) {
    console.log("Failed to update data");
  }
}

$(".delete-student-dialog-close-button, .delete-student-dialog-cancel").on(
  "click",
  function () {
    closeDeleteDialog();
  }
);

function closeDeleteDialog() {
  let deleteDialog = document.querySelector(".delete-student-dialog");
  deleteDialog.close();
}

$(".header-burger").on("click", function () {
  var nav = $("nav");
  var main = $("main");
  nav.toggleClass("active");
  var viewportWidth = $(window).width();

  if (viewportWidth <= 600) {
    if (nav.hasClass("active")) {
      main.hide();
    } else {
      main.show();
    }
  }
});

function handleViewportWidthChange() {
  var viewportWidth = $(window).width();
  var nav = $("nav");
  var main = $("main");

  if (viewportWidth <= 600) {
    if (nav.hasClass("active")) {
      main.hide();
    }
  }

  if (viewportWidth > 600) {
    if (nav.hasClass("active")) {
      main.show();
    }
  }
}

$(window).on("resize", handleViewportWidthChange);
handleViewportWidthChange();

$(".header-notification").on("click", function () {
  var notifications = $(".notifications-container");
  notifications.toggle();

  var notificationIndicator = $(".notification-indicator");
  notificationIndicator.hide();
});

$(".header-account").on("click", function () {
  var accountControl = $(".account-control-container");
  accountControl.toggle();
});

function addStudent() {
  fillIdField();

  let studentGroupInput = document.querySelector("#student-group");
  let studentGroup = studentGroupInput.value;

  let studentNameInput = document.querySelector("#student-name");
  let studentName = studentNameInput.value;

  let studentSurnameInput = document.querySelector("#student-surname");
  let studentSurname = studentSurnameInput.value;

  let studentGenderInput = document.querySelector("#student-gender");
  let studentGender = studentGenderInput.value;

  let studentBirthdayInput = document.querySelector("#student-birthday");
  let studentBirthday = studentBirthdayInput.value;

  // Format the birthday as dd.mm.yyyy
  let formattedBirthday = studentBirthday.split("-").reverse().join(".");

  // Get the table body element
  let tableBody = document.querySelector(".students-table tbody");

  // Create a new table row element
  let newRow = document.createElement("tr");

  // Create table cells and set their content
  let checkboxCell = document.createElement("td");
  checkboxCell.innerHTML = '<input type="checkbox" />';

  let studentIdCell = document.createElement("td");
  studentIdCell.textContent = `${studentGroup}`; // Replace with actual student ID

  let studentNameCell = document.createElement("td");
  studentNameCell.textContent = `${studentSurname} ${studentName}`; // Replace with actual name

  // ... Add more cells and set their content similarly

  // Append the cells to the new row
  newRow.appendChild(checkboxCell);
  newRow.appendChild(studentIdCell);
  newRow.appendChild(studentNameCell);
  // ... Append more cells

  let studentGenderCell = document.createElement("td");
  studentGenderCell.textContent = `${studentGender}`;

  let studentBirthdayCell = document.createElement("td");
  studentBirthdayCell.textContent = `${formattedBirthday}`;

  newRow.appendChild(studentGenderCell);
  newRow.appendChild(studentBirthdayCell);

  let statusCell = document.createElement("td");
  let statusContainer = document.createElement("div");
  statusContainer.classList.add("status-container");
  let statusInactive = document.createElement("div");
  statusInactive.classList.add("status-inactive");
  statusContainer.appendChild(statusInactive);
  statusCell.appendChild(statusContainer);

  let optionsCell = document.createElement("td");
  let optionsContainer = document.createElement("div");
  optionsContainer.classList.add("student-options-container");

  // Create edit and delete links with icons (replace src with your actual image paths)
  let editLink = document.createElement("a");
  editLink.classList.add("student-options-edit");
  editLink.href = "#"; // You can add a link here if needed
  editLink.innerHTML = '<img src="../Pictures/icons8-edit-24.png" alt="Edit">';

  editLink.addEventListener("click", function () {
    let studentDialog = document.querySelector(".student-dialog");
    studentDialog.showModal();

    studentEditFunction(editLink.parentElement.parentElement.parentElement);
  });

  optionsContainer.appendChild(editLink);

  let deleteLink = document.createElement("a");
  deleteLink.classList.add("student-options-delete");
  deleteLink.href = "#"; // You can add a link here if needed
  deleteLink.innerHTML =
    '<img src="../Pictures/icons8-delete-30.png" alt="Delete">';

  deleteLink.addEventListener("click", function () {
    deleteDialogFunction(deleteLink);
  });

  optionsContainer.appendChild(deleteLink);

  optionsCell.appendChild(optionsContainer);

  newRow.appendChild(statusCell);
  newRow.appendChild(optionsCell);

  // Append the new row to the table body
  tableBody.appendChild(newRow);

  // Close the dialog
  let studentDialog = document.querySelector(".student-dialog");
  studentDialog.close();

  sendAjax();

  /* Remove eveerything from input fields */

  studentGroupInput.value = "";
  studentNameInput.value = "";
  studentSurnameInput.value = "";
  studentGenderInput.value = "Male";
  studentBirthdayInput.value = "";
}

/*
function deleteDialogFunction(value) {
  value.addEventListener("click", function () {
    let deleteDialog = document.querySelector(".delete-student-dialog");
    deleteDialog.showModal();

    let studentRow = value.parentElement.parentElement.parentElement;
    let deleteButton = document.querySelector(".delete-student-dialog-delete");
    deleteButton.addEventListener("click", function () {
      studentRow.remove();
      deleteDialog.close();
    });
  });
}*/
