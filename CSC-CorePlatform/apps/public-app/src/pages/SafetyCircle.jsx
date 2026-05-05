import SectionHeader from "../components/ui/SectionHeader";
import ContactCard from "../components/safety-circle/ContactCard";
import { mockSafetyCircle } from "../data/mockSafetyCircle";

export default function SafetyCircle({ onNavigate }) {
  const handleAddContact = () => {
    alert("Adding a new trusted contact...\n\nForm opens for contact details.");
  };

  const handleImSafe = () => {
    alert("✓ Alert cleared\n\nYou've marked yourself as safe. Command Center has been notified.");
  };

  return (
    <div>
      <SectionHeader title="Your trusted circle" action="Add Contact" onAction={handleAddContact} />
      {mockSafetyCircle.map((contact) => <ContactCard key={contact.id} contact={contact} onNavigate={onNavigate} />)}
      <button onClick={handleImSafe} style={{ width: "100%", border: 0, borderRadius: 18, padding: 16, background: "var(--navy)", color: "#fff", fontWeight: 700, marginTop: 10, cursor: "pointer" }}>
        I'm Safe
      </button>
    </div>
  );
}
