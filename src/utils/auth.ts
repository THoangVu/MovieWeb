export type AuthUser = {
  email: string;
  name?: string;
};

const STORAGE_KEY = "mw_user";
const USERS_KEY = "mw_users";

export function getUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function login(user: AuthUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}

export function isAuthenticated(): boolean {
  return getUser() !== null;
}

export function getAllUsers(): AuthUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AuthUser[];
  } catch {
    return [];
  }
}

export function registerUser(newUser: AuthUser & { password: string }): { ok: boolean; message?: string } {
  const users = getAllUsers();
  const exists = users.some((u) => u.email.toLowerCase() === newUser.email.toLowerCase());
  if (exists) return { ok: false, message: "Email đã tồn tại" };
  const toStore = [...users, { email: newUser.email, name: newUser.name }];
  localStorage.setItem(USERS_KEY, JSON.stringify(toStore));
  // Store passwords in plain localStorage only for demo (not secure)
  localStorage.setItem(`mw_pwd_${newUser.email.toLowerCase()}`, newUser.password);
  return { ok: true };
}

export function validateCredentials(email: string, password: string): boolean {
  const stored = localStorage.getItem(`mw_pwd_${email.toLowerCase()}`);
  return !!stored && stored === password;
}


