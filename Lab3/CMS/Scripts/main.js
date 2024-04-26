window.onload = async function () {
  if (navigator.serviceWorker) {
    try {
      await navigator.serviceWorker.register("../Scripts/serviceWorker.js");
    } catch (error) {
      console.log("Can't register serviceWorker");
    }
  }

  fetchStudentsAndFillTable();
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

$(".server-error-dialog-button-container button").on("click", function () {
  let errorDialog = document.querySelector(".server-error-dialog");
  errorDialog.close();
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
    //studentRow.remove();
    deleteStudentFromBackend(studentRow);
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

  let studentId = document.getElementById("student-id");
  let id = studentRow.children[0].children[1].id;
  console.log(id);
  studentId.value = id;

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

  let studentId = parseInt(document.querySelector("#student-id").value);
  console.log(studentId);

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
/*
  //sendAjax();

  studentRow.children[1].textContent = studentGroup;
  studentRow.children[2].textContent = `${studentSurname} ${studentName}`;
  studentRow.children[3].textContent = studentGender;
  studentRow.children[4].textContent = formattedBirthday;
*/
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


  // Create student object
  const studentData = {
    id: studentId,
    group: studentGroup,
    name: studentName,
    surname: studentSurname,
    sex: studentGender.toLowerCase(),
    dateOfBirth: formattedBirthday
  };

  console.log(studentData);

  updateStudentInBackend(studentData);

}
/*
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
*/

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
/*
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
  tableBody.appendChild(newRow);*/

  // Close the dialog
  let studentDialog = document.querySelector(".student-dialog");
  studentDialog.close();

  /* Remove eveerything from input fields */

  studentGroupInput.value = "";
  studentNameInput.value = "";
  studentSurnameInput.value = "";
  studentGenderInput.value = "Male";
  studentBirthdayInput.value = "";



  // Create student object
  const studentData = {
    group: studentGroup,
    name: studentName,
    surname: studentSurname,
    sex: studentGender.toLowerCase(),
    dateOfBirth: formattedBirthday
    // Add more properties if needed
  };

  console.log(studentData);

  // Send student data to backend for addition
  addStudentToBackend(studentData);
}

async function addStudentToBackend(studentData) {
  try {
    const response = await fetch('http://localhost:8080/api/students/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(studentData)
    });
    if (!response.ok) {
      throw new Error('Failed to add student');
    }
    const newStudent = await response.json();
   
    //Update table
    fetchStudentsAndFillTable();
    console.log('Student added successfully:', newStudent);
  } catch (error) {
    console.error('Error adding student:', error);
    // Optionally, you can show an error message

    showServerError("Failed to add student");
  }
}

async function updateStudentInBackend(studentData) {
  try {
    const response = await fetch(`http://localhost:8080/api/students/${studentData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(studentData)
    });
    if (!response.ok) {
      throw new Error('Failed to update student');
    }
    const updatedStudent = await response.json();
    console.log('Student updated successfully:', updatedStudent);
    fetchStudentsAndFillTable();
  } catch (error) {
    console.error('Error updating student:', error);
    // Optionally, you can show an error message
    showServerError("Failed to update student");
  }
}

async function deleteStudentFromBackend(studentRow) {
  try {
    let studentId = studentRow.children[0].children[1].id;
    const response = await fetch(`http://localhost:8080/api/students/${studentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to delete student');
    }
    const deletedStudent = await response.json();
    console.log('Student deleted successfully:', deletedStudent);
    fetchStudentsAndFillTable();
  } catch (error) {
    console.error('Error deleting student:', error);
    // Optionally, you can show an error message
    showServerError("Failed to delete student");
  }
}

function showServerError(message) {
  let errorText = document.querySelector('.server-error-dialog-text');
  errorText.textContent = message;
  let errorDialog = document.querySelector('.server-error-dialog');
  errorDialog.showModal();
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

var currentPage = 0;

// Function to fetch students from the backend and fill the table
async function fetchStudentsAndFillTable(pageNumber = currentPage, pageSize = 10) {
  try {
    const url = `http://localhost:8080/api/students/page?page=${pageNumber}&size=${pageSize}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch students");
    }
    const studentsPage = await response.json();
    const students = studentsPage.content; // Extract students from the page
    fillTableWithStudents(students);

    // Update pagination controls
    updatePaginationControls(studentsPage);
    
    currentPage = pageNumber; // Update the global currentPage variable
  } catch (error) {
    console.error("Error fetching students:", error);
    // Handle error
  }
}

// Function to update pagination controls
function updatePaginationControls(studentsPage) {
  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = ''; // Clear existing pagination links

  const totalPages = studentsPage.totalPages;
  const currentPage = studentsPage.number + 1; // Page numbers start from 0

  if (totalPages > 1) {
    // Add previous page link
    if (currentPage > 1) {
      const prevPageLink = createPaginationLink(currentPage - 2, '<');
      paginationContainer.appendChild(prevPageLink);
    }

    // Add page links
    for (let i = 0; i < totalPages; i++) {
      const pageLink = createPaginationLink(i, i + 1);
      if (i === currentPage - 1) {
        pageLink.classList.add('pagination-active');
      }
      paginationContainer.appendChild(pageLink);
    }

    // Add next page link
    if (currentPage < totalPages) {
      const nextPageLink = createPaginationLink(currentPage, '>');
      paginationContainer.appendChild(nextPageLink);
    }
  }
}

// Function to create pagination link
function createPaginationLink(pageNumber, text) {
  const link = document.createElement('a');
  link.href = '#';
  link.textContent = text;
  link.addEventListener('click', () => {
    fetchStudentsAndFillTable(pageNumber);
  });
  return link;
}

// Function to fill the table with student data
function fillTableWithStudents(students) {
  const tableBody = document.querySelector(".students-table tbody");
  tableBody.innerHTML = ""; // Clear previous table data

  students.forEach((student) => {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td><input type="checkbox" /><input type='hidden' id='${student.id}'></td>
      <td>${student.group}</td>
      <td>${student.name} ${student.surname}</td>
      <td>${student.sex.charAt(0).toUpperCase() + student.sex.slice(1)}</td>
      <td>${student.dateOfBirth}</td>
      <td>
        <div class="status-container">
          <div class="status-${student.active ? "active" : "inactive"}"></div>
        </div>
      </td>
      <td>
        <div class="student-options-container">
          <a class="student-options-edit"><img src="../Pictures/icons8-edit-24.png" alt="Edit" /></a>
          <a class="student-options-delete"><img src="../Pictures/icons8-delete-30.png" alt="Delete" /></a>
        </div>
      </td>
    `;
    tableBody.appendChild(newRow);
    // Add event listeners for edit and delete
    newRow
      .querySelector(".student-options-edit")
      .addEventListener("click", function () {
        let studentDialog = document.querySelector(".student-dialog");
        studentDialog.showModal();

        //console.log(this.parentElement.parentElement.parentElement);
        studentEditFunction(this.parentElement.parentElement.parentElement);
      });
    newRow
      .querySelector(".student-options-delete")
      .addEventListener("click", function () {
        deleteDialogFunction(this);
      });
  });
}
