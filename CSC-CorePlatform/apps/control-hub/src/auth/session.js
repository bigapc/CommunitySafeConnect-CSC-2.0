export const SESSION_KEY = "csc-auth-session-v1";

export const DEMO_ACCOUNTS = [
  {
    id: "user-001",
    email: "apjune3@gmail.com",
    password: "Apcdaily123@$",
    fullName: "Darrell Armstrong",
    role: "apc_admin",
    org: "Armstrong Pack Company",
    avatar: "DA",
  },
  {
    id: "user-002",
    email: "supervisor@csc.app",
    password: "Super2026!",
    fullName: "Jordan Clarke",
    role: "csc_supervisor",
    org: "CSC Operations",
    avatar: "JC",
  },
  {
    id: "user-003",
    email: "responder@csc.app",
    password: "Resp2026!",
    fullName: "Morgan Reed",
    role: "apc_responder",
    org: "Armstrong Pack Company",
    avatar: "MR",
  },
  {
    id: "user-004",
    email: "member@csc.app",
    password: "Safe2026!",
    fullName: "Casey Williams",
    role: "community_member",
    org: "Community",
    avatar: "CW",
  },
];

export const HUB_ROLES = ["apc_admin", "apc_security_reviewer", "csc_supervisor"];

export function loadSession() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(user) {
  if (typeof window === "undefined") {
    return;
  }

  if (user) {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(SESSION_KEY);
  }
}

export function authenticateHubUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();

  const account = DEMO_ACCOUNTS.find(
    (candidate) =>
      candidate.email.toLowerCase() === normalizedEmail && candidate.password.trim() === normalizedPassword
  );

  if (!account) {
    return { ok: false, error: "Incorrect email or password." };
  }

  if (!HUB_ROLES.includes(account.role)) {
    return { ok: false, error: "This account does not have control-hub access." };
  }

  const { password: ignoredPassword, ...user } = account;
  return { ok: true, user };
}