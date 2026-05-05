import { useState } from "react";
import SectionHeader from "../components/ui/SectionHeader";
import ContactCard from "../components/safety-circle/ContactCard";
import AddContactForm from "../components/forms/AddContactForm";
import { mockSafetyCircle } from "../data/mockSafetyCircle";

export default function SafetyCircle({ onNavigate, onShowModal }) {
  const [contacts, setContacts] = useState(mockSafetyCircle);

  const handleAddContact = () => {
    onShowModal(
      "Add New Contact",
      <AddContactForm
        onSubmit={(formData) => {
          const newContact = {
            id: contacts.length + 1,
            ...formData,
          };
          setContacts([...contacts, newContact]);
          onShowModal(
            "Success!",
            <div>
              <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
              <p style={{ color: "var(--muted)" }}>
                {formData.name} has been added to your Safety Circle.
              </p>
            </div>,
            [{ label: "Done", primary: true }]
          );
        }}
        onCancel={() => {}}
      />,
      []
    );
  };

  const handleImSafe = () => {
    onShowModal(
      "Alert Status Updated",
      <div>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
        <p style={{ fontSize: 16, fontWeight: 600, color: "var(--green)", marginBottom: 12 }}>
          You're marked as safe
        </p>
        <p style={{ color: "var(--muted)", marginBottom: 14 }}>
          Your Safety Circle has been notified that you're safe. The incident record has been updated.
        </p>
        <ul style={{ color: "var(--muted)", fontSize: 13, paddingLeft: 18 }}>
          <li>3 contacts notified</li>
          <li>Command Center updated</li>
          <li>Incident log preserved</li>
        </ul>
      </div>,
      [{ label: "Return Home", primary: true }]
    );
  };

  return (
    <div>
      <SectionHeader title="Your trusted circle" action="Add Contact" onAction={handleAddContact} />
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} onNavigate={onNavigate} onShowModal={onShowModal} />
      ))}
      <button
        onClick={handleImSafe}
        style={{
          width: "100%",
          border: 0,
          borderRadius: 18,
          padding: 16,
          background: "var(--navy)",
          color: "#fff",
          fontWeight: 700,
          marginTop: 10,
          cursor: "pointer",
        }}
      >
        I'm Safe
      </button>
    </div>
  );
}
