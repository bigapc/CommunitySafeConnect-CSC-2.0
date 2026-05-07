export const mockHubIncidents = [
  {
    id: "inc-001",
    title: "Active SOS",
    location: "Northside Corridor",
    coordinates: [40.7152, -74.0021],
    priority: "critical",
    status: "active",
    assignedTo: "Responder Unit 3",
    createdAt: "2026-05-07T02:05:00.000Z",
    updatedAt: "2026-05-07T02:12:00.000Z",
    timeline: [
      { id: "evt-1001", at: "2026-05-07T02:12:00.000Z", message: "Responder Unit 3 assigned by dispatcher." },
      { id: "evt-1002", at: "2026-05-07T02:07:00.000Z", message: "Dispatcher acknowledged incident and initiated response protocol." },
      { id: "evt-1003", at: "2026-05-07T02:05:00.000Z", message: "SOS triggered from public app." },
    ],
  },
  {
    id: "inc-002",
    title: "Campus perimeter alert",
    location: "West Campus",
    coordinates: [40.7098, -74.0102],
    priority: "high",
    status: "acknowledged",
    assignedTo: "Dispatcher Review",
    createdAt: "2026-05-07T01:51:00.000Z",
    updatedAt: "2026-05-07T02:00:00.000Z",
    timeline: [
      { id: "evt-2001", at: "2026-05-07T02:00:00.000Z", message: "Camera feed reviewed and perimeter patrol notified." },
      { id: "evt-2002", at: "2026-05-07T01:51:00.000Z", message: "Automated perimeter sensor alert created." },
    ],
  },
];
