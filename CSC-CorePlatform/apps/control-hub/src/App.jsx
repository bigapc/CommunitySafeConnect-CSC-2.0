import { useEffect, useMemo, useState } from "react";
import HubLayout from "./components/layout/HubLayout";
import HubModal from "./components/ui/HubModal";
import HubAccessGate from "./components/auth/HubAccessGate";
import Dashboard from "./pages/Dashboard";
import MasterControlCenter from "./pages/MasterControlCenter";
import IncidentConsole from "./pages/IncidentConsole";
import Organizations from "./pages/Organizations";
import ResponderVerification from "./pages/ResponderVerification";
import SafeZoneManagement from "./pages/SafeZoneManagement";
import IncidentRecords from "./pages/IncidentRecords";
import SecurityReview from "./pages/SecurityReview";
import Broadcasts from "./pages/Broadcasts";
import Settings from "./pages/Settings";
import { mockHubIncidents } from "./data/mockIncidents";
import { mockResponders } from "./data/mockResponders";
import { mockHubZones } from "./data/mockSafeZones";
import { mockOrganizations } from "./data/mockOrganizations";
import { mockBroadcasts } from "./data/mockBroadcasts";
import { queueIntegrationEvent } from "../../../shared/utils/integrationBridge";

const pages = {
  dashboard: Dashboard,
  master: MasterControlCenter,
  incidents: IncidentConsole,
  organizations: Organizations,
  responders: ResponderVerification,
  zones: SafeZoneManagement,
  records: IncidentRecords,
  security: SecurityReview,
  broadcasts: Broadcasts,
  settings: Settings,
};

const storageKey = "csc-control-hub-state-v1";
const crossAppIncidentSnapshotKey = "csc-cross-app-public-incident-snapshot-v1";
const crossAppIncidentEventName = "csc:public-incidents-updated";

function readInitialState() {
  if (typeof window === "undefined") {
    return {
      incidents: mockHubIncidents,
      responders: mockResponders,
      zones: mockHubZones,
      organizations: mockOrganizations,
      broadcasts: mockBroadcasts,
      settings: {
        autoDispatch: true,
        criticalEscalation: true,
        smsBridge: false,
      },
      route: "dashboard",
    };
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return {
        incidents: mockHubIncidents,
        responders: mockResponders,
        zones: mockHubZones,
        organizations: mockOrganizations,
        broadcasts: mockBroadcasts,
        settings: {
          autoDispatch: true,
          criticalEscalation: true,
          smsBridge: false,
        },
        route: "dashboard",
      };
    }

    const parsed = JSON.parse(raw);
    return {
      incidents: Array.isArray(parsed.incidents) ? parsed.incidents : mockHubIncidents,
      responders: Array.isArray(parsed.responders) ? parsed.responders : mockResponders,
      zones: Array.isArray(parsed.zones) ? parsed.zones : mockHubZones,
      organizations: Array.isArray(parsed.organizations) ? parsed.organizations : mockOrganizations,
      broadcasts: Array.isArray(parsed.broadcasts) ? parsed.broadcasts : mockBroadcasts,
      settings: parsed.settings || {
        autoDispatch: true,
        criticalEscalation: true,
        smsBridge: false,
      },
      route: pages[parsed.route] ? parsed.route : "dashboard",
    };
  } catch {
    return {
      incidents: mockHubIncidents,
      responders: mockResponders,
      zones: mockHubZones,
      organizations: mockOrganizations,
      broadcasts: mockBroadcasts,
      settings: {
        autoDispatch: true,
        criticalEscalation: true,
        smsBridge: false,
      },
      route: "dashboard",
    };
  }
}

function timestampNow() {
  return new Date().toISOString();
}

function toHubPriority(incident) {
  const label = `${incident.type || ""} ${incident.status || ""}`.toLowerCase();
  if (label.includes("sos") || label.includes("active")) {
    return "critical";
  }
  if (label.includes("submitted") || label.includes("safety")) {
    return "high";
  }
  return "medium";
}

function toHubIncidentFromPublic(publicIncident) {
  const createdAt = publicIncident.createdAt || timestampNow();
  return {
    id: `ext-${publicIncident.id}`,
    externalIncidentId: publicIncident.id,
    source: "public-app",
    title: `${publicIncident.type || "Incident"} - Public App`,
    location: publicIncident.location || "Location shared via public app",
    safeZoneId: publicIncident.safeZoneId,
    safeZoneName: publicIncident.safeZoneName,
    safeZoneType: publicIncident.safeZoneType,
    priority: toHubPriority(publicIncident),
    status: publicIncident.status || "active",
    assignedTo: "Dispatcher Queue",
    createdAt,
    updatedAt: createdAt,
    timeline: [
      {
        id: `evt-import-${publicIncident.id}`,
        at: createdAt,
        message: `Imported from public app: ${publicIncident.notes || "New incident reported."}`,
      },
    ],
  };
}

function normalizePublicIncidentBatch(rawPayload) {
  if (!rawPayload) {
    return [];
  }

  const payload = typeof rawPayload === "string" ? JSON.parse(rawPayload) : rawPayload;
  if (!payload || !Array.isArray(payload.incidents)) {
    return [];
  }

  return payload.incidents;
}

function HubApp({ user, onSignOut }) {
  const initial = readInitialState();
  const [route, setRoute] = useState(initial.route);
  const [incidents, setIncidents] = useState(initial.incidents);
  const [responders, setResponders] = useState(initial.responders);
  const [zones, setZones] = useState(initial.zones);
  const [organizations, setOrganizations] = useState(initial.organizations);
  const [broadcasts, setBroadcasts] = useState(initial.broadcasts);
  const [settings, setSettings] = useState(initial.settings);
  const [modal, setModal] = useState({ isOpen: false, title: "", content: null, actions: [] });

  const mergePublicIncidents = (incoming = []) => {
    setIncidents((prev) => {
      const existingExternalIds = new Set(
        prev
          .filter((incident) => incident.source === "public-app")
          .map((incident) => incident.externalIncidentId)
      );

      const imported = incoming
        .filter((incident) => incident && incident.id)
        .filter((incident) => !existingExternalIds.has(incident.id))
        .map(toHubIncidentFromPublic);

      if (!imported.length) {
        return prev;
      }

      return [...imported, ...prev];
    });
  };

  const dashboardMetrics = useMemo(() => {
    const activeAlerts = incidents.filter((incident) => incident.status === "active").length;
    const pendingIncidents = incidents.filter((incident) => incident.status !== "resolved" && incident.status !== "archived").length;
    const verifiedResponders = responders.filter((responder) => responder.status === "verified").length;
    const safeZones = zones.filter((zone) => zone.status === "verified").length;
    const activeOrganizations = organizations.filter((org) => org.status === "active").length;
    return {
      activeAlerts,
      pendingIncidents,
      verifiedResponders,
      safeZones,
      organizations: activeOrganizations,
    };
  }, [incidents, responders, zones, organizations]);

  const showModal = (title, content, actions = []) => {
    setModal({ isOpen: true, title, content, actions });
  };

  const closeModal = () => {
    setModal({ isOpen: false, title: "", content: null, actions: [] });
  };

  const addIncidentEvent = (incidentId, message) => {
    const entry = { id: `evt-${Date.now()}`, at: timestampNow(), message };
    setIncidents((prev) =>
      prev.map((incident) => {
        if (incident.id !== incidentId) {
          return incident;
        }
        return {
          ...incident,
          timeline: [entry, ...(incident.timeline || [])],
          updatedAt: timestampNow(),
        };
      })
    );
  };

  const updateIncident = (incidentId, patch) => {
    setIncidents((prev) =>
      prev.map((incident) => (incident.id === incidentId ? { ...incident, ...patch, updatedAt: timestampNow() } : incident))
    );
  };

  const createBroadcast = (payload) => {
    const broadcast = {
      id: `b-${Date.now()}`,
      title: payload.title,
      audience: payload.audience,
      severity: payload.severity || "info",
      status: "sent",
      createdAt: timestampNow(),
    };
    setBroadcasts((prev) => [broadcast, ...prev]);
    queueIntegrationEvent({
      sourceApp: "control-hub",
      entityType: "broadcasts",
      action: "broadcast.created",
      entityId: broadcast.id,
      payload: broadcast,
      sourceUser: user,
    });
    return broadcast;
  };

  const exportIncidentsCsv = () => {
    const csv = [
      ["ID", "Title", "Location", "Priority", "Status", "AssignedTo", "UpdatedAt"],
      ...incidents.map((incident) => [
        incident.id,
        incident.title,
        incident.location,
        incident.priority,
        incident.status,
        incident.assignedTo || "",
        incident.updatedAt || incident.createdAt || "",
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `hub-incident-records-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const resetHubData = () => {
    setIncidents(mockHubIncidents);
    setResponders(mockResponders);
    setZones(mockHubZones);
    setOrganizations(mockOrganizations);
    setBroadcasts(mockBroadcasts);
    setSettings({ autoDispatch: true, criticalEscalation: true, smsBridge: false });
    setRoute("dashboard");
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        incidents,
        responders,
        zones,
        organizations,
        broadcasts,
        settings,
        route,
      })
    );
  }, [incidents, responders, zones, organizations, broadcasts, settings, route]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const ingestSnapshot = (payload) => {
      try {
        const incoming = normalizePublicIncidentBatch(payload);
        if (incoming.length) {
          mergePublicIncidents(incoming);
        }
      } catch {
        // Ignore malformed cross-app payloads.
      }
    };

    ingestSnapshot(window.localStorage.getItem(crossAppIncidentSnapshotKey));

    const onStorage = (event) => {
      if (event.key === crossAppIncidentSnapshotKey && event.newValue) {
        ingestSnapshot(event.newValue);
      }
    };

    const onCustomEvent = (event) => {
      ingestSnapshot(event.detail);
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(crossAppIncidentEventName, onCustomEvent);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(crossAppIncidentEventName, onCustomEvent);
    };
  }, []);

  const sharedProps = {
    user,
    route,
    onNavigate: setRoute,
    incidents,
    responders,
    zones,
    organizations,
    broadcasts,
    settings,
    dashboardMetrics,
    setResponders,
    setZones,
    setOrganizations,
    setSettings,
    showModal,
    closeModal,
    updateIncident,
    addIncidentEvent,
    createBroadcast,
    exportIncidentsCsv,
    resetHubData,
  };

  const Screen = pages[route] || Dashboard;

  return (
    <>
      <HubLayout route={route} onNavigate={setRoute} user={user} onSignOut={onSignOut}>
        <Screen {...sharedProps} />
      </HubLayout>
      <HubModal isOpen={modal.isOpen} title={modal.title} onClose={closeModal} actions={modal.actions}>
        {modal.content}
      </HubModal>
    </>
  );
}

export default function App() {
  return <HubAccessGate>{({ user, onSignOut }) => <HubApp user={user} onSignOut={onSignOut} />}</HubAccessGate>;
}
