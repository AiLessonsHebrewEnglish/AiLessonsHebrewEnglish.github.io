export function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

export function isLoggedIn() {
  return !!getUser();
}

export function hasPackage() {
  return !!getUser()?.package;
}

export function login(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem("user");
}
