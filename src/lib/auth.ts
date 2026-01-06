// Client-side auth utilities
const TOKEN_KEY = "csms_token";
const USER_ROLE_KEY = "csms_user_role";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
  }
}

export function getUserRole(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_ROLE_KEY);
}

export function setUserRole(role: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_ROLE_KEY, role);
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function hasRole(roles: string | string[]): boolean {
  const userRole = getUserRole();
  if (!userRole) return false;
  if (typeof roles === "string") return userRole === roles;
  return roles.includes(userRole);
}

export function isAdmin(): boolean {
  return hasRole("admin");
}

export function isTeacher(): boolean {
  return hasRole("teacher");
}

export function isStudent(): boolean {
  return hasRole("student");
}
