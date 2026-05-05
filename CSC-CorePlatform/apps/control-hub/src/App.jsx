import { useState } from "react";
import HubLayout from "./components/layout/HubLayout";
import Dashboard from "./pages/Dashboard";
import IncidentConsole from "./pages/IncidentConsole";
import Organizations from "./pages/Organizations";
import ResponderVerification from "./pages/ResponderVerification";
import SafeZoneManagement from "./pages/SafeZoneManagement";
import IncidentRecords from "./pages/IncidentRecords";
import SecurityReview from "./pages/SecurityReview";
import Broadcasts from "./pages/Broadcasts";
import Settings from "./pages/Settings";

const pages = {
  dashboard: Dashboard,
  incidents: IncidentConsole,
  organizations: Organizations,
  responders: ResponderVerification,
  zones: SafeZoneManagement,
  records: IncidentRecords,
  security: SecurityReview,
  broadcasts: Broadcasts,
  settings: Settings,
};

export default function App() {
  const [route, setRoute] = useState("dashboard");
  const Screen = pages[route] || Dashboard;

  return (
    <HubLayout route={route} onNavigate={setRoute}>
      <Screen />
    </HubLayout>
  );
}
