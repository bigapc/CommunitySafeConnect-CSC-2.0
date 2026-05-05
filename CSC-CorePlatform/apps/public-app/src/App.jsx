import { useState } from "react";
import PublicLayout from "./components/layout/PublicLayout";
import Home from "./pages/Home";
import SOS from "./pages/SOS";
import SafeZones from "./pages/SafeZones";
import SafetyCircle from "./pages/SafetyCircle";
import IncidentLog from "./pages/IncidentLog";
import OrganizationHub from "./pages/OrganizationHub";
import Settings from "./pages/Settings";
import ControlHub from "./pages/ControlHub";

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

  return (
    <PublicLayout route={route} onNavigate={handleNavigate} role={role}>
      <Screen onNavigate={handleNavigate} role={role} onRoleChange={handleRoleChange} />
    </PublicLayout>
  );
}
