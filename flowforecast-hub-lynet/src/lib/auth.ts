// Lightweight mock auth stored in localStorage.
// NOT secure — for demo purposes only.

const KEY = "flowsight.auth.user";

export interface AuthUser {
  email: string;
  name: string;
}

interface StoredAccount extends AuthUser {
  password: string;
}

const ACCOUNTS_KEY = "flowsight.auth.accounts";

function readAccounts(): StoredAccount[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeAccounts(list: StoredAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list));
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function signUp(name: string, email: string, password: string): AuthUser {
  email = email.trim().toLowerCase();
  if (!name.trim() || !email || password.length < 4) {
    throw new Error("Please enter your name, a valid email and a password (4+ chars).");
  }
  const accounts = readAccounts();
  if (accounts.some((a) => a.email === email)) {
    throw new Error("An account with this email already exists. Try signing in.");
  }
  const acc: StoredAccount = { name: name.trim(), email, password };
  accounts.push(acc);
  writeAccounts(accounts);
  const user: AuthUser = { name: acc.name, email: acc.email };
  localStorage.setItem(KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("flowsight-auth"));
  return user;
}

export function signIn(email: string, password: string): AuthUser {
  email = email.trim().toLowerCase();
  const accounts = readAccounts();
  const acc = accounts.find((a) => a.email === email && a.password === password);
  if (!acc) throw new Error("Invalid email or password.");
  const user: AuthUser = { name: acc.name, email: acc.email };
  localStorage.setItem(KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("flowsight-auth"));
  return user;
}

export function signOut() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("flowsight-auth"));
}
