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
};

const defaultRole = "community_member";
const routeAliases = {
  alerts: "home",
};

const incidentStorageKey = "csc-public-incidents-v1";

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

function readUrlState() {
  const params = new URLSearchParams(window.location.search);
  const role = params.get("role") || defaultRole;
  const rawView = params.get("view") || "home";
  const view = routeAliases[rawView] || rawView;
  return { role, view: screens[view] ? view : "home" };
}

function writeUrlState(role, view) {
  const params = new URLSearchParams(window.location.search);
  params.set("role", role || defaultRole);
  params.set("view", view);
  const nextUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, "", nextUrl);
}

export default function App() {
  const initial = readUrlState();
  const [role, setRole] = useState(initial.role);
  const [route, setRoute] = useState(initial.view);
  const [modal, setModal] = useState({ isOpen: false, title: "", content: null, actions: [] });
  const [incidents, setIncidents] = useState(readStoredIncidents);

  const Screen = screens[route] || Home;

  const handleNavigate = (nextRoute) => {
    const resolved = screens[nextRoute] ? nextRoute : "home";
    setRoute(resolved);
    writeUrlState(role, resolved);
  };

  const handleRoleChange = (nextRole) => {
    const resolvedRole = nextRole || defaultRole;
    setRole(resolvedRole);
    writeUrlState(resolvedRole, route);
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
      id: payload.id || `inc-${Date.now()}`,
      type: payload.type || "SOS",
      status: payload.status || "active",
      location: payload.location || "Location shared with Command Center",
      createdAt: now,
      notes: payload.notes || "Emergency support activated.",
    };

    setIncidents((prev) => [incident, ...prev]);
    return incident;
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(incidentStorageKey, JSON.stringify(incidents));
  }, [incidents]);

  return (
    <>
      <PublicLayout route={route} onNavigate={handleNavigate} role={role}>
        <Screen
          onNavigate={handleNavigate}
          role={role}
          onRoleChange={handleRoleChange}
          onShowModal={showModal}
          incidents={incidents}
          onCreateIncident={createIncident}
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
