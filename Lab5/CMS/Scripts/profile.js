document.addEventListener("DOMContentLoaded", async function () {
  const user = await getLoggedUser();
  

  // Fill the profile info fields with the user data
  const name = user.name;
  const surname = user.surname;
  let sex = user.sex;
  const dateOfBirth = user.dateOfBirth;
  const email = user.email;

  const profileInfo = $(".profile-info");
  const profileInfoTexts = profileInfo.find(".profile-data");

  // Set first letter to capital
  sex = sex.charAt(0).toUpperCase() + sex.slice(1);

  $(profileInfoTexts[0]).text(name);
  $(profileInfoTexts[1]).text(surname);
  $(".profile-data-email").text(email);
  $(profileInfoTexts[2]).text(sex);
  $(profileInfoTexts[3]).text(dateOfBirth);

  const picture = await getUserPhoto();
  // Set the profile photo
  const profilePhoto = $(".profile-photo img");

  profilePhoto.attr("src", picture);

});


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

  applyStylesOnWidthChange();
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

$("#logout-button").on("click", async function () {
  await logout();
});

$(".header-account").on("click", function () {
  var accountControl = $(".account-control-container");
  accountControl.toggle();
});

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
      window.location.href = "../Layouts/index.html";
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
function editProfile() {
  //Replace "edit" button with buttons "save" and "cancel"
  //Replace text with input fields
  var editButton = $(this);
  var profileInfo = $(".profile-info");
  var profileInfoEdit = $(".profile-info-edit");
  //var profileInfoInputs = $(".profile-info input");
  var profileInfoTexts = $(".profile-info .profile-data");
  var saveButton = $("<input>").attr("type", "submit").val("Save");
  var cancelButton = $("<button>").text("Cancel");

  //Remove the "edit" button
  editButton.remove();

  //Add the "save" and "cancel" buttons
  profileInfoEdit.append(saveButton);
  profileInfoEdit.append(cancelButton);

  //Replace text with input fields
  profileInfoTexts.each(function (index, element) {
    var text = $(element).text();
    var input;
    if ($(element).parent().parent().hasClass("profile-info-sex")) {
      input = $("<select>")
        .append($("<option>").text("Male"))
        .append($("<option>").text("Female"))
        .append($("<option>").text("Other"))
        .val(text)
        .data("original-text", text); // Set original text data attribute
    } else if ($(element).parent().parent().hasClass("profile-info-birthday")) {
      // Format date as YYYY-MM-DD
      var dateParts = text.split(".");
      var formattedDate =
        dateParts[2] +
        "-" +
        dateParts[1].padStart(2, "0") +
        "-" +
        dateParts[0].padStart(2, "0");
      input = $("<input>")
        .attr("type", "date")
        .val(formattedDate)
        .data("original-text", text); // Set original text data attribute
    } else {
      input = $("<input>")
        .attr("type", "text")
        .val(text)
        .data("original-text", text); // Set original text data attribute
    }
    $(element).replaceWith(input);
  });

  const profilePhoto = $(".profile-photo");
  const selectPhoto = $("<input>")
    .attr("type", "file")
    .attr("accept", "image/*")
    .attr("id", "profile-photo-input");
  profilePhoto.append(selectPhoto);

  //select an img (ancestor of the profilePhoto)
  const img = profilePhoto.find("img");
  //Save profile photo
  img.data("original-src", img.attr("src"));

  selectPhoto.on("change", function () {
    const file = selectPhoto[0].files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      //Set new picture

      img.attr("src", e.target.result);
      //profilePhoto.css("background-image", `url(${e.target.result})`);
    };
    reader.readAsDataURL(file);
  });

  //Add event listeners for the "save" and "cancel" buttons
  saveButton.on("click", function () {
    //saveProfileInfo();
  });

  cancelButton.on("click", function () {
    cancelProfileInfoEdit();
  });
}

$(".profile-info-edit button").on("click", editProfile);

document
  .getElementById("userForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    await saveProfileInfo();
  });

async function saveProfileInfo() {
  if (validateForm()) {
    var profileInfoEdit = $(".profile-info-edit");
    profileInfoEdit.find("input[type=submit]").remove();

    var profileInfoInputs = $(".profile-info input, .profile-info select");

    // Replace input fields with text
    profileInfoInputs.each(function (index, element) {
      var input = $(element);
      var text;
      if (input.is("input[type=date]")) {
        // Convert date format from YYYY-MM-DD to DD.MM.YYYY
        var dateParts = input.val().split("-");
        text = dateParts[2] + "." + dateParts[1] + "." + dateParts[0];
      } else {
        text = input.val();
      }
      input.replaceWith($("<span>").addClass("profile-data").text(text));
    });

    // Save profile info to the backend
    await saveProfileInfoToBackend();

    //Do the same for the profile photo

    const profilePhoto = $(".profile-photo");
    const img = profilePhoto.find("img");
    const selectPhoto = profilePhoto.find("input[type=file]"); // Correctly select the input field

    const originalSrc = img.data("original-src");
    const newSrc = img.attr("src");
    // Remove the input field and delete "original-src" data attribute
    selectPhoto.remove();
    img.removeData("original-src");

    // Remove the "save" and "cancel" buttons
    profileInfoEdit.find("button").remove();

    // Add the "edit" button
    var editButton = $("<button>").text("Edit");
    profileInfoEdit.append(editButton);

    // Add event listener for the "edit" button
    editButton.on("click", editProfile);
  }
}

function cancelProfileInfoEdit() {
  var profileInfoEdit = $(".profile-info-edit");
  profileInfoEdit.find("input[type=submit]").remove();

  var profileInfoInputs = $(".profile-info input, .profile-info select");
  var profileInfoTexts = $(".profile-info .profile-data");

  //Replace input fields with original text
  profileInfoInputs.each(function (index, element) {
    var input = $(element);
    var originalText = input.data("original-text");
    input.replaceWith($("<span>").addClass("profile-data").text(originalText));
  });

  //Do the same for the profile photo
  const profilePhoto = $(".profile-photo");
  const img = profilePhoto.find("img");
  const selectPhoto = profilePhoto.find("input[type=file]"); // Correctly select the input field
  const originalSrc = img.data("original-src");
  // Set the original picture
  img.attr("src", originalSrc);
  // Remove the input field and delete "original-src" data attribute
  selectPhoto.remove();
  img.removeData("original-src");

  //Remove the "save" and "cancel" buttons
  profileInfoEdit.find("button").remove();

  //Add the "edit" button
  var editButton = $("<button>").text("Edit");
  profileInfoEdit.append(editButton);

  //Add event listener for the "edit" button
  editButton.on("click", editProfile);
}

async function saveProfileInfoToBackend() {
  const profileInfo = $(".profile-info");
  const profileInfoTexts = profileInfo.find(".profile-data");
  const profileInfoInputs = profileInfo.find("input, select");
  const profilePhoto = $(".profile-photo");
  const img = profilePhoto.find("img");
  const selectPhoto = profilePhoto.find("input[type=file]"); // Correctly select the input field

  const firstName = $(profileInfoTexts[0]).text();
  const lastName = $(profileInfoTexts[1]).text();
  const sex = $(profileInfoTexts[2]).text();
  const birthday = $(profileInfoTexts[3]).text();
  const profilePhotoFile = selectPhoto[0].files[0]; // Get the selected file

  const formData = new FormData();
  // Append profile info fields to the FormData object
  formData.append("name", firstName);
  formData.append("surname", lastName);
  formData.append("sex", sex.toLowerCase());
  formData.append("dateOfBirth", birthday);

  // Append profile photo file to the FormData object
  formData.append("userPicture", profilePhotoFile);

  const accessToken = getCookie("access_token");

  try {
    const response = await fetchWithToken(`${address}/api/users/edit`, {
      method: "PUT",
      body: formData,
    });

    if (response.ok) {
      console.log("Profile info saved successfully");
    } else {
      console.error("Failed to save profile info");
      throw new Error("Failed to save profile info");
    }
  } catch (error) {
    console.error("Failed to save profile info:", error);
    throw new Error("Failed to save profile info");
  }
}

function validateForm() {
  var form = document.getElementById("userForm");
  var inputs = form.querySelectorAll("input, select");
  var isValid = true;

  let name = inputs[1].value;
  let surname = inputs[2].value;

  let errors = [];

  if (name === "") {
    errors.push("Name is required");
    isValid = false;
  } else if (!/^[a-zA-Z-]+$/.test(name.trim())) {
    errors.push("Name can only contain letters and dashes");
    isValid = false;
  }

  if (surname === "") {
    errors.push("Surname is required");
    isValid = false;
  } else if (!/^[a-zA-Z-]+$/.test(surname.trim())) {
    errors.push("Surname can only contain letters and dashes");
    isValid = false;
  }

  if (!isValid) {
    showValidationError(errors);
  }

  return isValid;
}

function showValidationError(errors) {
  const errorDialog = document.querySelector(".validation-error-dialog");

  // Fill the dialog with error messages
  const text = $(".validation-error-dialog-text");
  text.empty();
  let fullText = "";
  errors.forEach((error) => {
    fullText += error + "<br>";
  });

  text.append(fullText);

  // Show the dialog
  errorDialog.showModal();
}

$(".validation-error-dialog-button-container button").on("click", function () {
  let errorDialog = document.querySelector(".validation-error-dialog");
  errorDialog.close();
});



async function updateToken() {
  // Get refreshToken from cookies
  const refreshTokenCookie = getCookie("refresh_token");
  if (refreshTokenCookie) {
    // Send a request to the backend to update the token
    try {
      const response = await fetch(`${address}/api/users/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: refreshTokenCookie }),
      });

      if (!response.ok) {
        throw new Error("Failed to update token");
      }

      const data = await response.json();

      // Save the new token to cookies
      setCookie("access_token", data.accessToken, 1);
      //setCookie('refresh_token', data.refreshToken, 30);

      console.log("Token updated successfully:", data);
    } catch (error) {
      console.error("Failed to update token:", error);
      throw new Error("Failed to update token");
    }
  } else {
    //console.error('No refreshToken found in cookies');
    throw new Error("No refreshToken found in cookies");
  }
}


async function getLoggedUser() {
  //Get access token from cookies
  const accessTokenCookie = getCookie("access_token");
  if (accessTokenCookie) {
    // Send a request to the backend to get the user
    try {
      let result;
      let response = await fetchWithToken(`${address}/api/users/me`, {
        method: "POST",
      });


      const user = await response.json();
      console.log("User:", user);
      return user;
    } catch (error) {
      console.error("Failed to get user:", error);
      throw new Error("Failed to get user");
    }
  } else {
    console.error("No accessToken found in cookies");
    throw new Error("No accessToken found in cookies");
  }
}

async function getUserPhoto() {
  
  try {
    const response = await fetchWithToken(`${address}/api/users/getMyPicture`, {

    });

    if (response.ok) {
      // Get the blob object representing the photo file
      const blob = await response.blob();

      // Create an object URL for the blob
      const objectURL = URL.createObjectURL(blob);
      
      return objectURL;
    } else {
      console.error("Failed to fetch user photo:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching user photo:", error);
  }
}

async function fetchWithToken(url, options) {
  try {
    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: "Bearer " + getCookie("access_token"),
      },
    });

    console.log(response.status);

    if (response.status === 403) {
      console.log("Token expired");
      await updateToken(); // Refresh token
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: "Bearer " + getCookie("access_token"),
        },
      });
    }

    return response;
  } catch (error) {
    console.error("Error fetching with token:", error);
    throw new Error("Failed to fetch with token");
  }
}



defineLogged();

async function defineLogged() {
  // Check if the user is logged in
  // Try to update token and check if it is valid
  try {
    await updateToken();
    let user = await getLoggedUser();
    let photo = await getUserPhoto();

    let accountName = document.querySelector(".header-account-text");
    accountName.textContent = `${user.name} ${user.surname}`;

    let accountPhoto = document.querySelector(".header-account-photo");
    accountPhoto.src = photo;
  } catch (error) {
    console.error("User not logged in:", error);
    window.location.href = "../Layouts/index.html";
  }
}