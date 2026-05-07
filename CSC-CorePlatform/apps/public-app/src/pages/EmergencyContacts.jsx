import { useMemo, useState } from "react";
import AddContactForm from "../components/forms/AddContactForm";
import SectionHeader from "../components/ui/SectionHeader";

const systemContacts = [
  { id: "ec-1", name: "911 Emergency", phone: "911", type: "Emergency Services", priority: "critical" },
  { id: "ec-2", name: "Poison Control", phone: "(555) 123-4567", type: "Medical", priority: "high" },
  { id: "ec-3", name: "Mental Health Crisis", phone: "(555) 987-6543", type: "Mental Health", priority: "high" },
  { id: "ec-4", name: "Local Police Non-Emergency", phone: "(555) 234-5678", type: "Law Enforcement", priority: "normal" },
  { id: "ec-5", name: "Fire Department", phone: "(555) 345-6789", type: "Emergency Services", priority: "high" },
];

const customContactsStorageKey = "csc-custom-emergency-contacts-v1";
const favoritesStorageKey = "csc-emergency-contact-favorites-v1";
const recentCallsStorageKey = "csc-emergency-contact-recent-calls-v1";

function readStoredArray(storageKey, fallback) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return fallback;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export default function EmergencyContacts({ onShowModal, user }) {
  const [customContacts, setCustomContacts] = useState(() => readStoredArray(customContactsStorageKey, []));
  const [favorites, setFavorites] = useState(() => readStoredArray(favoritesStorageKey, ["ec-1"]));
  const [recentCalls, setRecentCalls] = useState(() => readStoredArray(recentCallsStorageKey, [
    { id: "rc-1", contact: "911 Emergency", date: "Today 2:15 PM", duration: "5 min" },
    { id: "rc-2", contact: "Local Police Non-Emergency", date: "Yesterday 10:30 AM", duration: "3 min" },
  ]));

  const contacts = useMemo(() => [...customContacts, ...systemContacts], [customContacts]);

  const persistState = (nextCustomContacts, nextFavorites = favorites, nextRecentCalls = recentCalls) => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(customContactsStorageKey, JSON.stringify(nextCustomContacts));
    window.localStorage.setItem(favoritesStorageKey, JSON.stringify(nextFavorites));
    window.localStorage.setItem(recentCallsStorageKey, JSON.stringify(nextRecentCalls));
  };

  const handleToggleFavorite = (id) => {
    setFavorites((prev) => {
      const nextFavorites = prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id];
      persistState(customContacts, nextFavorites, recentCalls);
      return nextFavorites;
    });
  };

  const handleCall = (contact) => {
    onShowModal(
      `Call ${contact.name}?`,
      <div>
        <p style={{ color: "var(--muted)", marginBottom: 12 }}>
          Ready to call {contact.name}?
        </p>
        <p style={{ color: "var(--navy)", fontWeight: 600, fontSize: 18, marginBottom: 12 }}>
          📞 {contact.phone}
        </p>
        <div style={{ background: "var(--bg-soft)", borderRadius: 12, padding: 12 }}>
          <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>
            ℹ️ Type: {contact.type}
          </p>
        </div>
      </div>,
      [
        { label: "Cancel", primary: false },
        {
          label: "Call Now",
          primary: true,
          onClick: () => {
            window.location.href = `tel:${contact.phone}`;
            const nextCall = {
              id: `rc-${Date.now()}`,
              contact: contact.name,
              date: new Date().toLocaleString(),
              duration: "just now",
            };
            const nextRecentCalls = [nextCall, ...recentCalls].slice(0, 8);
            setRecentCalls(nextRecentCalls);
            persistState(customContacts, favorites, nextRecentCalls.slice(0, 8));
          },
        },
      ]
    );
  };

  const handleOpenCreateModal = () => {
    onShowModal(
      "Add Emergency Contact",
      <AddContactForm
        onCancel={() => null}
        onSubmit={(formData) => {
          const nextCustomContacts = [
            {
              id: `custom-contact-${Date.now()}`,
              name: formData.name,
              phone: formData.phone,
              type: formData.relationship,
              priority: formData.priority,
              ownerId: user?.id || "shared",
            },
            ...customContacts,
          ];
          setCustomContacts(nextCustomContacts);
          persistState(nextCustomContacts);
          onShowModal(
            "Contact Added",
            <p style={{ color: "var(--muted)" }}>{formData.name} is now available in your emergency contact list.</p>,
            [{ label: "Done", primary: true }]
          );
        }}
      />,
      [{ label: "Close", primary: false }]
    );
  };

  const handleEditContact = (contact) => {
    onShowModal(
      `Edit ${contact.name}`,
      <AddContactForm
        initialData={{
          name: contact.name,
          relationship: contact.type,
          phone: contact.phone,
          priority: contact.priority,
        }}
        submitLabel="Save Changes"
        onCancel={() => null}
        onSubmit={(formData) => {
          const nextCustomContacts = customContacts.map((item) =>
            item.id === contact.id
              ? {
                  ...item,
                  name: formData.name,
                  phone: formData.phone,
                  type: formData.relationship,
                  priority: formData.priority,
                }
              : item
          );
          setCustomContacts(nextCustomContacts);
          persistState(nextCustomContacts);
          onShowModal(
            "Contact Updated",
            <p style={{ color: "var(--muted)" }}>{formData.name} has been updated.</p>,
            [{ label: "Done", primary: true }]
          );
        }}
      />,
      [{ label: "Close", primary: false }]
    );
  };

  const handleDeleteContact = (contact) => {
    onShowModal(
      "Delete Contact",
      <p style={{ color: "var(--muted)" }}>Remove {contact.name} from your emergency contacts?</p>,
      [
        { label: "Cancel", primary: false },
        {
          label: "Delete",
          primary: true,
          onClick: () => {
            const nextCustomContacts = customContacts.filter((item) => item.id !== contact.id);
            const nextFavorites = favorites.filter((favoriteId) => favoriteId !== contact.id);
            setCustomContacts(nextCustomContacts);
            setFavorites(nextFavorites);
            persistState(nextCustomContacts, nextFavorites, recentCalls);
          },
        },
      ]
    );
  };

  const handleViewAnalytics = () => {
    const categories = [...new Set(contacts.map((contact) => contact.type))];
    onShowModal(
      "Emergency Contact Analytics",
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div style={{ background: "var(--bg-soft)", borderRadius: 12, padding: 12 }}>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>Total Contacts</div>
            <div style={{ fontWeight: 800, fontSize: 24, color: "var(--navy)" }}>{contacts.length}</div>
          </div>
          <div style={{ background: "var(--bg-soft)", borderRadius: 12, padding: 12 }}>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>Favorite</div>
            <div style={{ fontWeight: 800, fontSize: 24, color: "var(--accent)" }}>{favorites.length}</div>
          </div>
          <div style={{ background: "var(--bg-soft)", borderRadius: 12, padding: 12 }}>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>Recent Calls</div>
            <div style={{ fontWeight: 800, fontSize: 24, color: "var(--blue)" }}>{recentCalls.length}</div>
          </div>
          <div style={{ background: "var(--bg-soft)", borderRadius: 12, padding: 12 }}>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>Custom Contacts</div>
            <div style={{ fontWeight: 800, fontSize: 24, color: "var(--green)" }}>{customContacts.length}</div>
          </div>
        </div>
        <div>
          <p style={{ fontWeight: 600, color: "var(--navy)", marginBottom: 8 }}>Contact Categories</p>
          <div style={{ display: "grid", gap: 6 }}>
            {categories.map((cat) => (
              <div key={cat} style={{ background: "var(--bg-soft)", borderRadius: 8, padding: 10, display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--navy)", fontWeight: 600 }}>{cat}</span>
                <span style={{ color: "var(--muted)", fontWeight: 600 }}>
                  {contacts.filter((c) => c.type === cat).length}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>,
      [{ label: "Close", primary: true }]
    );
  };

  const favoriteContacts = contacts.filter((c) => favorites.includes(c.id));
  const otherContacts = contacts.filter((c) => !favorites.includes(c.id));

  return (
    <div>
      <SectionHeader title="Emergency Contacts & Analytics" action="Analytics" onAction={handleViewAnalytics} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 16 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: 14, boxShadow: "var(--shadow)" }}>
          <div style={{ color: "var(--muted)", fontSize: 12, marginBottom: 4 }}>Personal Safety Directory</div>
          <div style={{ color: "var(--navy)", fontWeight: 700 }}>Store trusted contacts and keep quick-call access ready.</div>
        </div>
        <button
          onClick={handleOpenCreateModal}
          style={{
            border: 0,
            borderRadius: 16,
            padding: "0 16px",
            background: "var(--navy)",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
            minWidth: 108,
          }}
        >
          + Add
        </button>
      </div>

      {favoriteContacts.length > 0 && (
        <>
          <div style={{ background: "linear-gradient(135deg, var(--accent), #d67a86)", borderRadius: 20, padding: 16, marginBottom: 16, color: "#fff" }}>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>⭐ Quick Access</div>
            <div style={{ display: "grid", gap: 8 }}>
              {favoriteContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handleCall(contact)}
                  style={{
                    border: 0,
                    background: "rgba(255, 255, 255, 0.2)",
                    color: "#fff",
                    borderRadius: 12,
                    padding: "12px 14px",
                    fontWeight: 700,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  📞 {contact.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <SectionHeader title="All Emergency Contacts" />
      {otherContacts.map((contact) => (
        <div key={contact.id} style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "var(--shadow)", marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
            <div>
              <div style={{ fontWeight: 700, color: "var(--navy)" }}>{contact.name}</div>
              <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>{contact.type}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {contact.id.startsWith("custom-contact-") ? (
                <>
                  <button
                    onClick={() => handleEditContact(contact)}
                    style={{
                      background: "none",
                      border: 0,
                      fontSize: 16,
                      cursor: "pointer",
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteContact(contact)}
                    style={{
                      background: "none",
                      border: 0,
                      fontSize: 16,
                      cursor: "pointer",
                    }}
                  >
                    🗑️
                  </button>
                </>
              ) : null}
              <button
                onClick={() => handleToggleFavorite(contact.id)}
                style={{
                  background: "none",
                  border: 0,
                  fontSize: 20,
                  cursor: "pointer",
                }}
              >
                {favorites.includes(contact.id) ? "⭐" : "☆"}
              </button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button
              onClick={() => handleCall(contact)}
              style={{
                border: 0,
                borderRadius: 12,
                padding: "10px 12px",
                background: contact.priority === "critical" ? "var(--accent)" : "var(--navy)",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              📞 Call
            </button>
            <button
              style={{
                border: "1px solid var(--line)",
                borderRadius: 12,
                padding: "10px 12px",
                background: "#fff",
                color: "var(--navy)",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              {contact.phone}
            </button>
          </div>
        </div>
      ))}

      {recentCalls.length > 0 && (
        <>
          <SectionHeader title="Recent Calls" />
          {recentCalls.map((call) => (
            <div key={call.id} style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "var(--shadow)", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, color: "var(--navy)" }}>{call.contact}</div>
                  <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>{call.date}</div>
                </div>
                <div style={{ color: "var(--muted)", fontWeight: 600, fontSize: 13 }}>
                  ⏱️ {call.duration}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
