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

  globalStudentRow = null;
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
  //Remove all event listeners
  let newButton = deleteButton.cloneNode(true);
  deleteButton.parentNode.replaceChild(newButton, deleteButton);
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

$("#logout-button").on("click", async function () {
  await logout();
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
  let studentName = studentRow.children[2].textContent.split(" ")[0];
  let studentSurname = studentRow.children[2].textContent.split(" ")[1];
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
    dateOfBirth: formattedBirthday,
  };

  console.log(studentData);

  updateStudentInBackend(studentData);
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

$(".header-notification").on("mouseenter", function () {
  var notifications = $(".notifications-container");
  notifications.toggle();

  var notificationIndicator = $(".notification-indicator");
  notificationIndicator.hide();
});

$(".header-notification").on("mouseleave", function () {
  var notifications = $(".notifications-container");
  notifications.toggle();

  var notificationIndicator = $(".notification-indicator");
  notificationIndicator.hide();
});

$(".header-notification").on("click", function () {
  window.location.href = "../Layouts/messages.html";
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
    dateOfBirth: formattedBirthday,
    // Add more properties if needed
  };

  console.log(studentData);

  // Send student data to backend for addition
  addStudentToBackend(studentData);
}

async function addStudentToBackend(studentData) {
  try {
    const response = await fetchWithToken(`${address}/api/students/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    });

    if (!response.ok) {
      throw new Error("Failed to add student");
    }

    const newStudent = await response.json();
    fetchStudentsAndFillTable();
    console.log("Student added successfully:", newStudent);
  } catch (error) {
    console.error("Error adding student:", error);
    showServerError("Failed to add student");
  }
}

async function updateStudentInBackend(studentData) {
  try {
    const response = await fetchWithToken(
      `${address}/api/students/${studentData.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update student");
    }
    const updatedStudent = await response.json();
    console.log("Student updated successfully:", updatedStudent);
    fetchStudentsAndFillTable();
  } catch (error) {
    console.error("Error updating student:", error);
    showServerError("Failed to update student");
  }
}

async function deleteStudentFromBackend(studentRow) {
  try {
    const studentId = studentRow.children[0].children[1].id;
    const response = await fetchWithToken(
      `${address}/api/students/${studentId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete student");
    }
    const deletedStudent = await response.json();
    console.log("Student deleted successfully:", deletedStudent);
    fetchStudentsAndFillTable();
  } catch (error) {
    console.error("Error deleting student:", error);
    showServerError("Failed to delete student");
  }
}

function showServerError(message) {
  let errorText = document.querySelector(".server-error-dialog-text");
  errorText.textContent = message;
  let errorDialog = document.querySelector(".server-error-dialog");
  errorDialog.showModal();
}

var currentPage = 0;

// Function to fetch students from the backend and fill the table
async function fetchStudentsAndFillTable(
  pageNumber = currentPage,
  pageSize = 10
) {
  try {
    const url = `${address}/api/students/page?page=${pageNumber}&size=${pageSize}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch students");
    }
    const studentsPage = await response.json();
    let logged;
    try {
      await updateToken();
      await getLoggedUser();
      logged = true;
    } catch (error) {
      logged = false;
    }
    const students = studentsPage.content; // Extract students from the page
    //const students = studentsPage;
    fillTableWithStudents(students, logged);

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
  paginationContainer.innerHTML = ""; // Clear existing pagination links

  const totalPages = studentsPage.totalPages;
  const currentPage = studentsPage.number + 1; // Page numbers start from 0

  //console.log(studentsPage);

  if (totalPages > 1) {
    // Add previous page link
    if (currentPage > 1) {
      const prevPageLink = createPaginationLink(currentPage - 2, "<");
      paginationContainer.appendChild(prevPageLink);
    }

    // Add page links
    for (let i = 0; i < totalPages; i++) {
      const pageLink = createPaginationLink(i, i + 1);
      if (i === currentPage - 1) {
        pageLink.classList.add("pagination-active");
      }
      //console.log(i, currentPage - 1, pageLink.classList, );
      paginationContainer.appendChild(pageLink);
    }

    // Add next page link
    if (currentPage < totalPages) {
      const nextPageLink = createPaginationLink(currentPage, ">");
      paginationContainer.appendChild(nextPageLink);
    }
  }
}

// Function to create pagination link
function createPaginationLink(pageNumber, text) {
  const link = document.createElement("a");
  link.href = "#";
  link.textContent = text;
  link.addEventListener("click", () => {
    fetchStudentsAndFillTable(pageNumber);
  });
  return link;
}

// Function to fill the table with student data
function fillTableWithStudents(students, logged) {
  const tableBody = document.querySelector(".students-table tbody");
  tableBody.innerHTML = ""; // Clear previous table data

  students.forEach((student) => {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td class="hide"><input type="checkbox" /><input type='hidden' id='${
        student.id
      }'></td>
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
    if (!logged) {
      newRow.querySelector(".student-options-container").classList.add("hide");
    }
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

function setLogged(isLogged) {
  let addButton = document.querySelector(".table-add-student");
  if (isLogged) {
    addButton.classList.remove("hide");
  } else {
    addButton.classList.add("hide");
  }

  let table = document.querySelector(".students-table");
  let optionsHeader = table.querySelector(".options-header");
  if (isLogged) {
    optionsHeader.classList.remove("hide");
  } else {
    optionsHeader.classList.add("hide");
  }
  let rows = table.querySelectorAll("tr");
  console.log(rows);
  rows.forEach((row) => {
    let options = row.cells[6];
    if (isLogged) {
      options.classList.remove("hide");
    } else {
      console.log("Hiding options");
      options.classList.add("hide");
    }
  });

  //let accountPhoto = document.querySelector(".header-account-photo");
  //let accountText = document.querySelector(".header-account-text");
  //let unloggedText = document.querySelector(".header-account-unlogged-text");
  let loggedHeaderAccount = document.querySelector("#logged-header-account");
  let unloggedHeaderAccount = document.querySelector("#unlogged-header-account");
  if (isLogged) {
    $(".header-account").on("click", function () {
      var accountControl = $(".account-control-container");
      accountControl.toggle();
    });

    //accountPhoto.classList.remove("hide");
    //accountText.classList.remove("hide");
    //unloggedText.classList.add("hide");
    loggedHeaderAccount.classList.remove("hide");
    unloggedHeaderAccount.classList.add("hide");
  } else {
    $(".header-account").off("click");
    var accountControl = $(".account-control-container");
    accountControl.hide();

    //accountPhoto.classList.add("hide");
    //accountText.classList.add("hide");
    //unloggedText.classList.remove("hide");
    loggedHeaderAccount.classList.add("hide");
    unloggedHeaderAccount.classList.remove("hide");
  }

  let notification = document.querySelector(".header-notification");
  if (isLogged) {
    notification.classList.remove("hide");
  } else {
    notification.classList.add("hide");
  }
}

$("#login-button").on("click", function () {
  window.location.href = "../Layouts/auth.html";
});

defineLogged();

async function defineLogged() {
  // Check if the user is logged in
  // Try to update token and check if it is valid
  try {
    await updateToken();
    let user = await getLoggedUser();
    setLogged(true);

    await updateAccountHeader(user);
  } catch (error) {
    console.error("User not logged in:", error);
    await setLogged(false);
  }
}

async function updateAccountHeader(user) {
  let accountName = document.querySelector(".header-account-text");
  accountName.textContent = `${user.name} ${user.surname}`;

  let photo = await getUserPhoto();

  let accountPhoto = document.querySelector(".header-account-photo");
  accountPhoto.src = photo;
}

async function logout() {
  // Get refreshToken from cookies
  const refreshTokenCookie = getCookie("refresh_token");
  if (refreshTokenCookie) {
    // Send a request to the backend to update the token
    try {
      const response = await fetch(`${address}/api/users/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: refreshTokenCookie }),
      });

      //Remove cookies
      document.cookie =
        "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      console.log("Logged out successfully");
      setLogged(false);
    } catch (error) {
      console.error("Failed to log out:", error);
      throw new Error("Failed to log out");
    }
  } else {
    console.error("No refreshToken found in cookies");
    throw new Error("No refreshToken found in cookies");
  }
}

$("#profile-button").on("click", function () {
  window.location.href = "../Layouts/profile.html";
});

// Messages thing

const nakedAddress = address.replace("http://", "").replace("https://", "");
const socket = new io(`ws://${nakedAddress}`);

socket.on("new-message", async (message) => {
  //console.log("New message received:", message);
  let image = await getOthersPhotoId(message.sender);
  //console.log("NEW MESSAGE");
  message.image = image;

  let user = await fetch(
    `${address}/api/users/user/id/${message.sender}`,
    {
      method: "GET",
    }
  );
  user = await user.json();
  message.nameSurname = `${user.name} ${user.surname}`;

  showNotification();
  hideNoNotifications();
  addMessage(message);
});

async function openRoom(room) {
  socket.emit("join-specific-room", room.id); // Emitting the join-specific-room event
  //console.log("Joined room:", room);
}

function openAllRooms() {
  getMyRooms().then(async (data) => {
    data.rooms.forEach(async (room) => {
      openRoom(room);
    });
  });
}

openAllRooms();

function showNotification() {
  let notificationIndicator = $(".notification-indicator");
  notificationIndicator.show();
}

function addMessage(message) {
  let messagesContainer = document.querySelector(".notifications-container");
  let messageElement = document.createElement("div");
  messageElement.classList.add("single-notification");
  messageElement.innerHTML = `
  <img
  class="notification-photo"
  
  alt="Profile picture"
/>
<div class="notification-text">
  <p class="notification-text-name">${message.nameSurname}</p>
  <p class="notification-text-content">${message.message}</p>
</div>
  `;

  let image = messageElement.querySelector(".notification-photo");
  image.src = message.image;

  messagesContainer.appendChild(messageElement);
}

function hideNoNotifications() {
  let noNotifications = document.querySelector("#no-notifications");
  noNotifications.style.display = "none";
}