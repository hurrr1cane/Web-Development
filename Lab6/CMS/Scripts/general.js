
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

async function getUserPhoto() {
  try {
    const response = await fetchWithToken(
      `${address}/api/users/getMyPicture`,
      {}
    );

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

async function getOthersPhotoEmail(email) {
  console.log("Email:", email);
  try {
    const response = await fetch(
      `${address}/api/users/userPicture/email/${email}`,
      {}
    );

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

async function getOthersPhotoId(id) {
  console.log("Id:", id);
  try {
    const response = await fetch(
      `${address}/api/users/userPicture/id/${id}`,
      {}
    );

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

async function getLoggedUser() {
  //Get access token from cookies
  const accessTokenCookie = getCookie("access_token");
  if (accessTokenCookie) {
    // Send a request to the backend to get the user
    try {
      let result;
      let response = await fetch(`${address}/api/users/me`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessTokenCookie}`,
        },
      });

      if (!response.ok) {
        //Try to update token
        let responsek = await updateToken();
        if (!responsek.ok) {
          throw new Error("Failed to get user");
        } else {
          response = await fetch(`${address}/api/users/me`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessTokenCookie}`,
            },
          });
        }
      }

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

function getMyRooms() {
  return fetchWithToken(`${address}/api/users/rooms`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      return data;
    });
}