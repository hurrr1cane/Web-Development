var currentRoom = null;
var sender = null;

async function fillSender() {
  const user = await getLoggedUser();
  sender = user.id;
}
fillSender();

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

// Function to check viewport width and apply styles accordingly
function applyStylesOnWidthChange() {
  const viewportWidth = window.innerWidth;

  if (
    viewportWidth < 800 &&
    document.querySelector("nav").classList.contains("active")
  ) {
    // Apply styles when viewport width is less than 800px and nav is active
    document.querySelector(".container").style.flexDirection = "column";
    document.querySelector(".chats-container").style.width = "100%";
    document.querySelector(".chats-container").style.height = "40vh";
    document.querySelector(".conversation").style.height = "50vh";
    document.querySelector(".messages-container").style.minHeight = "60vh";
    document.querySelector(".messages-container").style.height = "60vh";
  } else {
    // Reset styles if conditions are not met
    document.querySelector(".container").style.flexDirection = "";
    document.querySelector(".chats-container").style.width = "";
    document.querySelector(".chats-container").style.height = "";
    document.querySelector(".conversation").style.height = "";
    document.querySelector(".messages-container").style.minHeight = "";
    document.querySelector(".messages-container").style.height = "";
  }
}

// Call the function initially to apply styles based on initial viewport width
$(window).on("resize", applyStylesOnWidthChange);
applyStylesOnWidthChange();

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

const nakedAddress = address.replace("http://", "").replace("https://", "");
const socket = new io(`ws://${nakedAddress}`);

// Function to update messages list
function updateMessagesList(data) {
  console.log("UPDATING DATA");
  console.log(data);
  //if (data.roomId === currentRoomId) {
  const messagesContainer = document.querySelector(".messages-container");
  const messageElement = document.createElement("div");

  let dateTime = new Date(data.dateTime);
    // If it is today, display only the time, Else display the date and time
    let formattedDate = dateTime.toLocaleDateString();
    let formattedTime = dateTime.toLocaleTimeString();
    if (dateTime.toDateString() === new Date().toDateString()) {
      formattedDate = "";
    }
    let formattedDateTime = `${formattedDate} ${formattedTime}`;

    

  if (data.sender === sender) {
    messageElement.classList.add("message-my");
    messageElement.innerHTML = `
        <div class="message-my">
          <div class="message">
            <p class="message-text">${data.message}</p>
            <p class="message-time">${formattedDateTime}</p>
          </div>
        </div>`;
  } else {
    messageElement.classList.add("message-other");
    messageElement.innerHTML = `

          <img src="../Pictures/your-picture.png" alt="" class="img" />
          <div class="message">
            <p class="message-name">${data.nameSurname}</p>
            <p class="message-text">${data.message}</p>
            <p class="message-time">${formattedDateTime}</p>
          </div>
        `;

    messageElement.querySelector("img").src = data.image;
  }

  messagesContainer.appendChild(messageElement);

  requestAnimationFrame(() => {

    // Scroll to the exact position
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });

  //}
}

// Listen for new messages in the current room
socket.on("new-message", async (data) => {
  let image = await getOthersPhotoId(data.sender);
  console.log("NEW MESSAGE");
  data.image = image;

  let user = await fetch(
    `${address}/api/users/user/id/${data.sender}`,
    {
      method: "GET",
    }
  );
  user = await user.json();
  data.nameSurname = `${user.name} ${user.surname}`;

  updateMessagesList(data)
});

// Send message to the current room
function sendMessage() {
  const message = $("#message-field").val();
  console.log(message);
  if (message === "" || message === null) {
    return;
  }

  socket.emit("send-message", {
    message: message,
    roomId: currentRoom.id,
    sender: sender,
  });

  $("#message-field").val("");
}

// Event listeners
$("#send-button").on("click", sendMessage);
$("#message-field").on("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});



function fillRooms() {
  getMyRooms().then(async (data) => {
    const user = await getLoggedUser();
    const roomsList = document.querySelector(".chats-list");
    roomsList.innerHTML = "";

    data.rooms.forEach(async (room) => {
      console.log(room);
      const roomElement = document.createElement("div");
      roomElement.classList.add("chat-item");
      //Exclude the current user email from the list

      const members = room.members
        .filter((member) => member !== user.email)
        .join(", ");

      let pictureSrc;
      if (room.members.length > 2) {
        pictureSrc = "../Pictures/icons8-group-48.png";
      } else {
        console.log(room.members[0]);
        let picture = await getOthersPhotoEmail(members);
        pictureSrc = picture;
      }

      roomElement.innerHTML = `
      <img alt="" class="img" />
      <p>${members}</p>
      `;
      roomElement.querySelector("img").src = pictureSrc;
      roomElement.setAttribute("data-id", room.id);
      roomElement.addEventListener("click", () => {
        openRoom(room);
        roomElement.classList.add("active");
        const otherRooms = document.querySelectorAll(".chat-item");
        otherRooms.forEach((otherRoom) => {
          if (otherRoom !== roomElement) {
            otherRoom.classList.remove("active");
          }
        });
        document.querySelector(".conversation").classList.remove("hide");
      });
      //console.log(roomElement);
      roomsList.appendChild(roomElement);
    });
  });
}

async function openRoom(room) {
  socket.emit("join-specific-room", room.id); // Emitting the join-specific-room event
  //фетч історії повідомлень

  const messagesContainer = document.querySelector(".messages-container");
  messagesContainer.innerHTML = "";

  let messages = await fetchWithToken(
    `${address}/api/rooms/${room.id}/messages`,
    {
      method: "GET",
    }
  );

  messages = await messages.json();
  console.log(messages);

  currentRoom = room;

  showMembers(room.members);

  fillMessages(messages);
}

function showMembers(members) {
  const participants = document.querySelector(".participants");
  participants.innerHTML = "";
  members.forEach(async (member) => {
    console.log(member);
    let picture = await getOthersPhotoEmail(member);
    const memberElement = document.createElement("img");
    memberElement.classList.add("img");
    memberElement.src = picture;
    participants.appendChild(memberElement);
  });
}

async function fillMessages(messages) {
  let images = {};

  // Map over messages to get images
  for (const message of messages) {
    if (!images[message.sender]) {
      let picture = await getOthersPhotoId(message.sender);
      images[message.sender] = picture;
    }
  }

  let nameSurnames = {};

  // Map over messages to get name and surname
  for (const message of messages) {
    if (!nameSurnames[message.sender]) {
      let user = await fetch(
        `${address}/api/users/user/id/${message.sender}`,
        {
          method: "GET",
        }
      );
      user = await user.json();
      nameSurnames[message.sender] = `${user.name} ${user.surname}`;
    }
  }


  const messagesContainer = document.querySelector(".messages-container");
  messagesContainer.innerHTML = "";

  messages.forEach((message) => {
    let dateTime = new Date(message.dateTime);
    // If it is today, display only the time, Else display the date and time
    let formattedDate = dateTime.toLocaleDateString();
    let formattedTime = dateTime.toLocaleTimeString();
    if (dateTime.toDateString() === new Date().toDateString()) {
      formattedDate = "";
    }
    let formattedDateTime = `${formattedDate} ${formattedTime}`;

    const messageElement = document.createElement("div");
    if (message.sender === sender) {
      messageElement.classList.add("message-my");
      messageElement.innerHTML = `<div class="message-my">
    <div class="message">
      <p class="message-text">${message.message}</p>
      <p class="message-time">${formattedDateTime}</p>
    </div>`;
    } else {
      messageElement.classList.add("message-other");
      messageElement.innerHTML = `
      <img src="../Pictures/your-picture.png" alt="" class="img" />
    <div class="message">
      <p class="message-name">${nameSurnames[message.sender]}</p>
      <p class="message-text">${message.message}</p>
      <p class="message-time">${formattedDateTime}</p>
    </div>`;

      messageElement.querySelector("img").src = images[message.sender];
    }

    messagesContainer.appendChild(messageElement);
  });

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

fillRooms();

$("#add-room").on("click", async function () {
  let email = $("#email-to-add").val();
  if (validateRoomName(email)) {
    if (await createRoom(email)) {
      fillRooms();
    } else {
      showEmailError("There is no user with this email");
    }
  }
});

function showEmailError(errorMessage) {
  let error = document.querySelector("#incorrect-email");
  error.textContent = errorMessage;
  error.style.display = "block";
  //Show error message for 3 seconds
  setTimeout(() => {
    error.style.display = "none";
  }, 3000);
}

function validateRoomName(email) {
  if (email === "") {
    showEmailError("Email cannot be empty");
    return false;
  } // Check email for regex
  else if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    showEmailError("Incorrect email format");
    return false;
  } else {
    return true;
  }
}

async function createRoom(email) {
  return fetchWithToken(`${address}/api/rooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email }),
  })
    .then((response) => {
      if (response.ok) {
        return true;
      } else {
        return false;
      }
    })
    .catch((error) => {
      console.error("Failed to create room:", error);
      return false;
    });
}

async function updateAccountHeader(user) {
  let accountName = document.querySelector(".header-account-text");
  accountName.textContent = `${user.name} ${user.surname}`;

  let photo = await getUserPhoto();

  let accountPhoto = document.querySelector(".header-account-photo");
  accountPhoto.src = photo;
}

async function fillAccountInfo() {
  const user = await getLoggedUser();
  await updateAccountHeader(user);
}

fillAccountInfo();



const showAddParticipantButton = document.querySelector(".add-participant button");
let addParticipantShown = false;

showAddParticipantButton.addEventListener("click", async () => {
  const input = document.querySelector("#add-participant-input-container");
  const message = document.querySelector("#add-participant-message");

  if (!addParticipantShown) {
    input.classList.remove("hide");

    addParticipantShown = true;
  } else {
    input.classList.add("hide");
    message.classList.add("hide");
    addParticipantShown = false;
  }
});

const addParticipantButton = document.querySelector(".add-participant-button");
addParticipantButton.addEventListener("click", async () => {
  const input = document.querySelector("#add-participant-input");
  

  const email = input.value;

  if (email === "") {
    showEmailAddParticipantError("Email cannot be empty");
    return;
  }

  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    showEmailAddParticipantError("Incorrect email format");
    return;
  }

  //const result = await addParticipant(email);
  const result = await fetchWithToken(`${address}/api/rooms/addParticipant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roomId: currentRoom.id, email: email }),
  })
    .then((response) => {
      if (response.ok) {
        return true;
      } else {
        return false;
      }
    })
    .catch((error) => {
      console.error("Failed to add participant:", error);
      return false;
    });
  if (result) {
    showEmailAddParticipantError("Participant added successfully");
    input.value = "";
    await fillRooms();
    currentRoom.members.push(email);
    await openRoom(currentRoom);
    return;
  } else {
    showEmailAddParticipantError("User with this email does not exist or something went wrong");
    return;
  }
});

function showEmailAddParticipantError(errorMessage) {
  const message = document.querySelector("#add-participant-message");
  message.textContent = errorMessage;
  message.classList.remove("hide");
  //Show error message for 3 seconds
  setTimeout(() => {
    message.classList.add("hide");
  }, 3000);
}