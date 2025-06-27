const API = "http://localhost:3000";

// ELEMENTS
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const showRegister = document.getElementById("show-register");
const showLogin = document.getElementById("show-login");
const authSection = document.getElementById("auth-section");
const profileSection = document.getElementById("profile-section");
const profileForm = document.getElementById("profile-form");
const profileUsersList = document.getElementById("profile-users-list");
const selectedUserDiv = document.getElementById("selected-user");
const mentorSection = document.getElementById("mentor-section");
const mentorNameSpan = document.getElementById("mentor-name");
const mentorSpecialtySpan = document.getElementById("mentor-specialty");
const navbar = document.querySelector(".navbar");
const logoutBtn = document.getElementById("logout-btn");

let currentUser = null;
let editingProfileId = null; // NEW: track editing state

// MENTORS DATA
const mentors = {
  anxiety: { name: "Cherry", specialty: "Anxiety" },
  grief: { name: "Lauren", specialty: "Grief" },
  stress: { name: "Richard", specialty: "Stress" },
  loneliness: { name: "Elvis", specialty: "Loneliness" }
};

// SHOW REGISTER/LOGIN FORMS
showRegister.addEventListener("click", () => {
  loginForm.style.display = "none";
  registerForm.style.display = "block";
});
showLogin.addEventListener("click", () => {
  registerForm.style.display = "none";
  loginForm.style.display = "block";
});

// LOGIN
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;
  const res = await fetch(`${API}/users?username=${username}&password=${password}`);
  const data = await res.json();
  if (data.length > 0) {
    currentUser = data[0];
    authSection.style.display = "none";
    profileSection.style.display = "block";
    navbar.style.display = "flex";
    loadUsers();
  } else {
    alert("Invalid credentials");
  }
});

// REGISTER
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("register-username").value;
  const password = document.getElementById("register-password").value;
  const res = await fetch(`${API}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  alert("Registered! Now login.");
  registerForm.reset();
  registerForm.style.display = "none";
  loginForm.style.display = "block";
});

// LOGOUT
logoutBtn.addEventListener("click", () => {
  location.reload();
});

// PROFILE FORM SUBMIT
profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("profile-name").value;
  const location = document.getElementById("profile-location").value;
  const image = document.getElementById("profile-image").value;
  const phone = document.getElementById("profile-phone").value;
  const age = document.getElementById("profile-age").value;
  const struggle = document.getElementById("struggle").value;
  const profile = { userId: currentUser.id, name, location, image, phone, age, struggle };

  if (editingProfileId) {
    await fetch(`${API}/profiles/${editingProfileId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile)
    });
    editingProfileId = null;
  } else {
    await fetch(`${API}/profiles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile)
    });
  }

  profileForm.reset();
  loadUsers();
  showMentor(struggle);
});

// LOAD USERS
async function loadUsers() {
  profileUsersList.innerHTML = "";
  const res = await fetch(`${API}/profiles`);
  const data = await res.json();
  data.forEach((profile) => {
    const div = document.createElement("div");
    div.className = "user-card";
    div.textContent = profile.name;
    div.addEventListener("click", () => showUser(profile));
    profileUsersList.appendChild(div);
  });
}

// SHOW USER
function showUser(profile) {
  selectedUserDiv.innerHTML = `
    <h3>${profile.name}</h3>
    <p><strong>Location:</strong> ${profile.location}</p>
    <p><strong>Phone:</strong> ${profile.phone}</p>
    <p><strong>Age:</strong> ${profile.age}</p>
    <p><strong>Struggle:</strong> ${profile.struggle}</p>
    <img src="${profile.image}" alt="${profile.name}" width="150"/>
  `;

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.classList.add("edit-btn");
  editBtn.addEventListener("click", () => editUser(profile.id));

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.addEventListener("click", () => deleteUser(profile.id));

  selectedUserDiv.appendChild(editBtn);
  selectedUserDiv.appendChild(deleteBtn);
}

// SHOW MENTOR
function showMentor(struggle) {
  const mentor = mentors[struggle];
  mentorSection.style.display = "block";
  profileSection.style.display = "none";
  mentorNameSpan.textContent = mentor.name;
  mentorSpecialtySpan.textContent = mentor.specialty;
}

// DELETE USER
async function deleteUser(id) {
  if (confirm("Are you sure you want to delete this user?")) {
    await fetch(`${API}/profiles/${id}`, { method: "DELETE" });
    selectedUserDiv.innerHTML = "";
    loadUsers();
  }
}

// EDIT USER
async function editUser(id) {
  const res = await fetch(`${API}/profiles/${id}`);
<<<<<<< HEAD
  const data = await res.json();

  document.getElementById("profile-name").value = data.name;
  document.getElementById("profile-location").value = data.location;
  document.getElementById("profile-image").value = data.image;
  document.getElementById("profile-phone").value = data.phone;
  document.getElementById("profile-age").value = data.age;
  document.getElementById("struggle").value = data.struggle;

  await fetch(`${API}/profiles/${id}`, { method: "DELETE" });

  selectedUserDiv.innerHTML = "";
  loadUsers();
}
=======
  const profile = await res.json();
  document.getElementById("profile-name").value = profile.name;
  document.getElementById("profile-location").value = profile.location;
  document.getElementById("profile-image").value = profile.image;
  document.getElementById("profile-phone").value = profile.phone;
  document.getElementById("profile-age").value = profile.age;
  document.getElementById("struggle").value = profile.struggle;
  editingProfileId = id; // store for updating later
}
>>>>>>> 87679c7 (my first commit)
