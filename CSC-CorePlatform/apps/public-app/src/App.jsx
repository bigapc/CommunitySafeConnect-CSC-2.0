import { useEffect, useState } from "react";
import PublicLayout from "./components/layout/PublicLayout";
import Modal from "./components/ui/Modal";
import Home from "./pages/Home";
import SOS from "./pages/SOS";
import SafeZones from "./pages/SafeZones";
import SafetyCircle from "./pages/SafetyCircle";
import IncidentLog from "./pages/IncidentLog";
import OrganizationHub from "./pages/OrganizationHub";
import Settings from "./pages/Settings";
import ControlHub from "./pages/ControlHub";
import CommunityFeed from "./pages/CommunityFeed";
import EmergencyContacts from "./pages/EmergencyContacts";
import UserProfile from "./pages/UserProfile";
import LoginPage from "./pages/LoginPage";
import { AuthProvider, useAuth, HUB_ROLES } from "./context/AuthContext";
import { mockIncidents } from "./data/mockIncidents";
import "./styles/animations.css";

const screens = {
  home: Home,
  sos: SOS,
  safezones: SafeZones,
  circle: SafetyCircle,
  incidents: IncidentLog,
  organization: OrganizationHub,
  settings: Settings,
  "control-hub": ControlHub,
  feed: CommunityFeed,
  emergency: EmergencyContacts,
  profile: UserProfile,
};

const defaultRole = "community_member";
const routeAliases = {
  alerts: "home",
};

const incidentStorageKey = "csc-public-incidents-v1";
const crossAppIncidentSnapshotKey = "csc-cross-app-public-incident-snapshot-v1";
const crossAppIncidentEventName = "csc:public-incidents-updated";

function readStoredIncidents() {
  if (typeof window === "undefined") {
    return mockIncidents;
  }

  try {
    const raw = window.localStorage.getItem(incidentStorageKey);
    if (!raw) {
      return mockIncidents;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return mockIncidents;
    }
    return parsed;
  } catch {
    return mockIncidents;
  }
}

function readInitialRoute() {
  const params = new URLSearchParams(window.location.search);
  const rawView = params.get("view") || "home";
  const view = routeAliases[rawView] || rawView;
  return screens[view] ? view : "home";
}

function writeUrlRoute(view) {
  const params = new URLSearchParams(window.location.search);
  params.set("view", view);
  window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
}

function AppInner() {
  const { user } = useAuth();
  const role = user?.role || defaultRole;
  const [route, setRoute] = useState(readInitialRoute);
  const [modal, setModal] = useState({ isOpen: false, title: "", content: null, actions: [] });
  const [incidents, setIncidents] = useState(readStoredIncidents);

  // If not logged in, show the login page
  if (!user) return <LoginPage />;

  // Hub-only routes: redirect non-hub users back to home
  const hubOnlyRoutes = ["control-hub"];
  const resolvedRoute = hubOnlyRoutes.includes(route) && !HUB_ROLES.includes(role) ? "home" : route;
  const Screen = screens[resolvedRoute] || Home;

  const handleNavigate = (nextRoute) => {
    const resolved = screens[nextRoute] ? nextRoute : "home";
    setRoute(resolved);
    writeUrlRoute(resolved);
  };

  const showModal = (title, content, actions = []) => {
    setModal({ isOpen: true, title, content, actions });
  };

  const closeModal = () => {
    setModal({ isOpen: false, title: "", content: null, actions: [] });
  };

  const createIncident = (payload = {}) => {
    const now = new Date().toISOString();
    const incident = {
      ...payload,
      id: payload.id || `inc-${Date.now()}`,
      type: payload.type || "SOS",
      status: payload.status || "active",
      location: payload.location || "Location shared with Command Center",
      createdAt: now,
      notes: payload.notes || "Emergency support activated.",
      reportedBy: user?.fullName || "Anonymous",
    };

    setIncidents((prev) => [incident, ...prev]);
    return incident;
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(incidentStorageKey, JSON.stringify(incidents));

    const payload = {
      source: "public-app",
      updatedAt: new Date().toISOString(),
      incidents,
    };

    window.localStorage.setItem(crossAppIncidentSnapshotKey, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent(crossAppIncidentEventName, { detail: payload }));
  }, [incidents]);

  return (
    <>
      <PublicLayout route={resolvedRoute} onNavigate={handleNavigate} role={role} user={user}>
        <Screen
          onNavigate={handleNavigate}
          role={role}
          onShowModal={showModal}
          incidents={incidents}
          onCreateIncident={createIncident}
          user={user}
        />
      </PublicLayout>
      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        onClose={closeModal}
        actions={modal.actions}
      >
        {modal.content}
      </Modal>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
