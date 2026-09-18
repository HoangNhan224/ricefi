// Auth helpers — lưu token + role ở localStorage (Phase F2)
const TOKEN_KEY = "rf_token";
const ROLE_KEY = "rf_role";

export function saveAuth({ token, role }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRole() {
  return localStorage.getItem(ROLE_KEY);
}

export function isAuthed() {
  return Boolean(getToken());
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
}

// Redirect theo role: FARMER → /farmer, BUYER → /buyer
export function homeForRole(role) {
  return role === "BUYER" ? "/buyer" : "/farmer";
}
