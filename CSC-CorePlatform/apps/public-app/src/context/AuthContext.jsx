import { createContext, useContext, useState, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Demo accounts – swap these out for Supabase auth calls when ready
// ---------------------------------------------------------------------------
const DEMO_ACCOUNTS = [
  {
    id: "user-001",
    email: "admin@csc.app",
    password: "Admin2026!",
    fullName: "Alex Armstrong",
    role: "apc_admin",
    org: "Armstrong Pack Company",
    avatar: "AA",
    bio: "Platform administrator for CommunitySafeConnect.",
  },
  {
    id: "user-002",
    email: "supervisor@csc.app",
    password: "Super2026!",
    fullName: "Jordan Clarke",
    role: "csc_supervisor",
    org: "CSC Operations",
    avatar: "JC",
    bio: "CSC supervisor overseeing incident response.",
  },
  {
    id: "user-003",
    email: "responder@csc.app",
    password: "Resp2026!",
    fullName: "Morgan Reed",
    role: "apc_responder",
    org: "Armstrong Pack Company",
    avatar: "MR",
    bio: "Verified responder based in North District.",
  },
  {
    id: "user-004",
    email: "member@csc.app",
    password: "Safe2026!",
    fullName: "Casey Williams",
    role: "community_member",
    org: "Community",
    avatar: "CW",
    bio: "Community member keeping the neighbourhood safe.",
  },
];

const SESSION_KEY = "csc-auth-session-v1";

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveSession(user) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadSession());
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    saveSession(user);
  }, [user]);

  const login = useCallback((email, password) => {
    const account = DEMO_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
    );
    if (!account) {
      setAuthError("Incorrect email or password.");
      return false;
    }
    const { password: _pwd, ...safeUser } = account;
    setUser(safeUser);
    setAuthError("");
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAuthError("");
  }, []);

  const updateProfile = useCallback((updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  }, []);

  const clearError = useCallback(() => setAuthError(""), []);

  return (
    <AuthContext.Provider value={{ user, authError, login, logout, updateProfile, clearError, demoAccounts: DEMO_ACCOUNTS }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export const HUB_ROLES = ["apc_admin", "apc_security_reviewer", "csc_supervisor"];
