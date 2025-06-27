const API = "http://localhost:3000";

// Elements
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

// Mentors list
const mentors = {
  anxiety: { name: "Cherry", specialty: "Anxiety" },
  grief: { name: "Lauren", specialty: "Grief" },
  stress: { name: "Richard", specialty: "Stress" },
  loneliness: { name: "Elvis", specialty: "Loneliness" },
};

// Show forms toggle
showRegister.addEventListener("click", () => {
  loginForm.style.display = "none";
  registerForm.style.display = "block";
});

showLogin.addEventListener("click", () => {
  registerForm.style.display = "none";
  loginForm.style.display = "block";
});

// Register
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("register-username").value;
  const password = document.getElementById("register-password").value;

  const res = await fetch(`${API}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (res.ok) {
    alert("Registration successful. Please log in.");
    registerForm.reset();
    registerForm.style.display = "none";
    loginForm.style.display = "block";
  }
});

// Login
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
    alert("Login failed. Check credentials.");
  }
});

// Logout
logoutBtn.addEventListener("click", () => {
  location.reload();
});

// Submit profile
profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const profile = {
    userId: currentUser.id,
    name: document.getElementById("profile-name").value,
    location: document.getElementById("profile-location").value,
    image: document.getElementById("profile-image").value,
    phone: document.getElementById("profile-phone").value,
    age: document.getElementById("profile-age").value,
    struggle: document.getElementById("struggle").value,
  };

  await fetch(`${API}/profiles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });

  profileForm.reset();
  loadUsers();
  showMentor(profile.struggle);
});

// Load all users
async function loadUsers() {
  profileUsersList.innerHTML = "";
  const res = await fetch(`${API}/profiles`);
  const data = await res.json();

  data.forEach((user) => {
    const div = document.createElement("div");
    div.className = "user-card";
    div.textContent = user.name;
    div.addEventListener("click", () => showUser(user));
    profileUsersList.appendChild(div);
  });
}

// Show selected user
function showUser(profile) {
  selectedUserDiv.innerHTML = `
    <h3>${profile.name}</h3>
    <p><strong>Location:</strong> ${profile.location}</p>
    <p><strong>Phone:</strong> ${profile.phone}</p>
    <p><strong>Age:</strong> ${profile.age}</p>
    <p><strong>Struggle:</strong> ${profile.struggle}</p>
    <img src="${profile.image}" alt="${profile.name}" width="150"/>
    <div class="btn-group">
      <button onclick="editUser(${profile.id})" class="edit-btn">Edit</button>
      <button onclick="deleteUser(${profile.id})" class="delete-btn">Delete</button>
    </div>
  `;
}

// Show mentor after profile complete
function showMentor(struggle) {
  const mentor = mentors[struggle];
  profileSection.style.display = "none";
  mentorSection.style.display = "block";
  mentorNameSpan.textContent = mentor.name;
  mentorSpecialtySpan.textContent = mentor.specialty;
}

// Delete user
async function deleteUser(id) {
  if (confirm("Are you sure you want to delete this user?")) {
    await fetch(`${API}/profiles/${id}`, {
      method: "DELETE",
    });
    selectedUserDiv.innerHTML = "";
    loadUsers();
  }
}

// Edit user
async function editUser(id) {
  const res = await fetch(`${API}/profiles/${id}`);
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