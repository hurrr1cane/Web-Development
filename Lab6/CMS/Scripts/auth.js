
document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.querySelector(".registration form");
  const nameInput = document.getElementById("name");
  const surnameInput = document.getElementById("surname");
  const sexInput = document.getElementById("sex");
  const dateInput = document.getElementById("date");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirm");
  const signupButton = document.querySelector(".registration form .button");

  signupButton.addEventListener("click", async function (event) {
    event.preventDefault();

    // Reset previous error messages
    resetErrors();

    // Validate inputs
    let isValid = true;
    if (nameInput.value.trim() === "") {
      showError(nameInput, "Name is required");
      isValid = false;
    }

    //Check if name has only letters and dashes
    else if (!/^[a-zA-Z-]+$/.test(nameInput.value.trim())) {
      showError(nameInput, "Name can only contain letters and dashes");
      isValid = false;
    }

    if (surnameInput.value.trim() === "") {
      showError(surnameInput, "Surname is required");
      isValid = false;
    }

    //Check if surname has only letters and dashes
    else if (!/^[a-zA-Z-]+$/.test(surnameInput.value.trim())) {
      showError(surnameInput, "Surname can only contain letters and dashes");
      isValid = false;
    }

    if (sexInput.value.trim() === "") {
      showError(sexInput, "Sex is required");
      isValid = false;
    }

    if (dateInput.value.trim() === "") {
      showError(dateInput, "Birthdate is required");
      isValid = false;
    }

    if (emailInput.value.trim() === "") {
      showError(emailInput, "Email is required");
      isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      showError(emailInput, "Please enter a valid email address");
      isValid = false;
    }

    if (passwordInput.value === "") {
      showError(passwordInput, "Password is required");
      isValid = false;
    }

    //Check if password has at least 8 characters, contains at least one uppercase letter, one lowercase letter, one number and one special character
    else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        passwordInput.value.trim()
      )
    ) {
      showError(
        passwordInput,
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
      );
      isValid = false;
    }

    if (confirmInput.value === "") {
      showError(confirmInput, "Confirm your password");
      isValid = false;
    } else if (confirmInput.value !== passwordInput.value) {
      showError(confirmInput, "Passwords do not match");
      isValid = false;
    }

    // If all inputs are valid, submit the form
    if (isValid) {
      try {
        await registrationToBackend();
        loginEmailInput.value = emailInput.value;
        loginPasswordInput.value = passwordInput.value;
        //console.log("Registration successful");
        await loginToBackend();
        //Redirect to home page
        window.location.href = "../Layouts/index.html";
      } catch (error) {
        console.log("Registration failed", error);
      }
    }
  });

  function showError(input, message) {
    const formControl = input.parentElement; // Get the parent element of the input
    const errorMessage = formControl.querySelector(".error-message"); // Find the error message element within the parent
    errorMessage.innerText = message; // Set the error message text
    formControl.classList.add("error"); // Add the 'error' class to the parent element
  }

  function resetErrors() {
    const inputContaners = document.querySelectorAll(".input-container"); // Select all elements with the 'error' class within the form
    inputContaners.forEach(function (container) {
      const errorMessage = container.querySelector(".error-message"); // Find the error message element within the parent
      errorMessage.innerText = ""; // Clear the error message text
      container.classList.remove("error"); // Remove the 'error' class from the parent element
    });
  }

  function isValidEmail(email) {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const loginButton = document.querySelector(".login form .button");
  const loginEmailInput = document.getElementById("email-login");
  const loginPasswordInput = document.getElementById("password-login");

  loginButton.addEventListener("click", async function (event) {
    event.preventDefault();

    // Reset previous error messages
    resetErrors();

    // Validate inputs
    let isValid = true;

    if (loginEmailInput.value.trim() === "") {
      showError(loginEmailInput, "Email is required");
      isValid = false;
    } else if (!isValidEmail(loginEmailInput.value.trim())) {
      showError(loginEmailInput, "Please enter a valid email address");
      isValid = false;
    }

    if (loginPasswordInput.value === "") {
      showError(loginPasswordInput, "Password is required");
      isValid = false;
    }

    // If all inputs are valid, submit the form
    if (isValid) {
      try {
        let result = await loginToBackend();
        //Redirect to home page
        window.location.href = "../Layouts/index.html";
      } catch (error) {
        showError(loginPasswordInput, "Invalid email or password");
      }
    }
  });

  async function registrationToBackend() {
    const name = nameInput.value;
    const surname = surnameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const sex = sexInput.value;
    let birthday = dateInput.value;
    let dateOfBirth = new Date(birthday);
    //Format it to be DD.MM.YYYY not DD.M.YYYY and not DD/MM/YYYY
    // Get day, month, and year components from the date
    let day = dateOfBirth.getDate().toString().padStart(2, "0");
    let month = (dateOfBirth.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed, so we add 1
    let year = dateOfBirth.getFullYear();

    // Format date to DD.MM.YYYY
    birthday = `${day}.${month}.${year}`;

    const data = {
      name: name,
      surname: surname,
      email: email,
      password: password,
      sex: sex,
      dateOfBirth: birthday,
    };

    try {
      const response = await fetch(`${address}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      // If registration is successful, log success message
      //console.log("Success:", await response.json());
      //console.log("Success");
      return; // Return nothing if registration is successful
    } catch (error) {
      showError(emailInput, error.message);
      throw error; // Rethrow the error to propagate it to the caller
    }
    return;
  }

  async function loginToBackend() {
    const email = loginEmailInput.value;
    const password = loginPasswordInput.value;

    const data = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch(`${address}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const responseData = await response.json();

      console.log("Success:", responseData);

      setCookie("access_token", responseData.accessToken, 1);
      setCookie("refresh_token", responseData.refreshToken, 1);

      return responseData; // Return the login data
    } catch (error) {
      console.error("Error:", error);
      throw error; // Rethrow the error to propagate it to the caller
    }
  }

  // Function to retrieve a cookie by name
  function getCookie(name) {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split("=");
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
  }

  // Function to set a cookie
  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    const cookie = value + ";" + expires + ";path=/";

    // Check if the cookie already exists
    const existingCookie = getCookie(name);
    if (existingCookie) {
      // If the cookie exists, replace its value in the document.cookie string
      document.cookie = document.cookie.replace(existingCookie, cookie);
    } else {
      // If the cookie doesn't exist, simply append it to the document.cookie string
      document.cookie = name + "=" + cookie;
    }
  }
});
