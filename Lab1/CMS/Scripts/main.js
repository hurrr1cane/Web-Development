//Add student event listener
document
  .querySelector(".table-add-student")
  .addEventListener("click", function () {
    let studentDialog = document.querySelector(".student-dialog");
    studentDialog.showModal();
  });

document
  .querySelector(".student-dialog-close-button")
  .addEventListener("click", function () {
    let studentDialog = document.querySelector(".student-dialog");
    studentDialog.close();
  });

document.querySelectorAll(".student-options-delete").forEach(function (value) {
  deleteDialogFunction(value);
});

document
  .querySelector(".delete-student-dialog-close-button")
  .addEventListener("click", closeDeleteDialog);

document
  .querySelector(".delete-student-dialog-cancel")
  .addEventListener("click", closeDeleteDialog);

function closeDeleteDialog() {
  let deleteDialog = document.querySelector(".delete-student-dialog");
  deleteDialog.close();
}

document.querySelector(".header-burger").addEventListener("click", function () {
  let nav = document.querySelector("nav");
  //nav.style.display = nav.style.display === "block" ? "none" : "block";

  let main = document.querySelector("main");

  nav.classList.toggle("active");

  let viewportWidth = window.innerWidth;

  // Check if viewport width is less than or equal to 600 pixels
  if (viewportWidth <= 600) {
    if (nav.classList.contains("active")) {
      main.style.display = "none";
    } else {
      main.style.display = "block";
    }
  }
});

function handleViewportWidthChange() {
  let viewportWidth = window.innerWidth;

  // Get the element you want to check for the class
  let nav = document.querySelector("nav");
  let main = document.querySelector("main");
  // Check viewport width
  if (viewportWidth <= 600) {
    if (nav.classList.contains("active")) {
      main.style.display = "none";
    }
  }

  if (viewportWidth > 600) {
    if (nav.classList.contains("active")) {
      main.style.display = "block";
    }
  }
}

// Add event listener for viewport resize
window.addEventListener("resize", handleViewportWidthChange);

// Initial call to handle viewport width on page load
handleViewportWidthChange();

document
  .querySelector(".header-notification")
  .addEventListener("click", function () {
    let notifications = document.querySelector(".notifications-container");
    notifications.style.display =
      notifications.style.display === "flex" ? "none" : "flex";

    let notificationIndicator = document.querySelector(
      ".notification-indicator"
    );
    notificationIndicator.style.display = "none";
  });

document
  .querySelector(".header-account")
  .addEventListener("click", function () {
    let accountControl = document.querySelector(".account-control-container");
    accountControl.style.display =
      accountControl.style.display === "flex" ? "none" : "flex";
  });

document
  .querySelector(".student-dialog-save")
  .addEventListener("click", function () {
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
    editLink.innerHTML =
      '<img src="../Pictures/icons8-edit-24.png" alt="Edit">';
    optionsContainer.appendChild(editLink);

    let deleteLink = document.createElement("a");
    deleteLink.classList.add("student-options-delete");
    deleteLink.href = "#"; // You can add a link here if needed
    deleteLink.innerHTML =
      '<img src="../Pictures/icons8-delete-30.png" alt="Delete">';

    deleteLink.addEventListener("click", deleteDialogFunction(deleteLink));
    optionsContainer.appendChild(deleteLink);

    optionsCell.appendChild(optionsContainer);

    newRow.appendChild(statusCell);
    newRow.appendChild(optionsCell);

    // Append the new row to the table body
    tableBody.appendChild(newRow);

    // Close the dialog
    let studentDialog = document.querySelector(".student-dialog");
    studentDialog.close();

    /* Remove eveerything from input fields */

    studentGroupInput.value = "";
    studentNameInput.value = "";
    studentSurnameInput.value = "";
    studentGenderInput.value = "Male";
    studentBirthdayInput.value = "";
  });

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
}
