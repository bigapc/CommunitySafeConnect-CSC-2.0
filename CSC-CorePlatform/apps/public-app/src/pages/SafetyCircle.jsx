import SectionHeader from "../components/ui/SectionHeader";
import ContactCard from "../components/safety-circle/ContactCard";
import { mockSafetyCircle } from "../data/mockSafetyCircle";

export default function SafetyCircle() {
  return (
    <div>
      <SectionHeader title="Your trusted circle" action="Add Contact" />
      {mockSafetyCircle.map((contact) => <ContactCard key={contact.id} contact={contact} />)}
      <button style={{ width: "100%", border: 0, borderRadius: 18, padding: 16, background: "var(--navy)", color: "#fff", fontWeight: 700, marginTop: 10 }}>
        I'm Safe
      </button>
    </div>
  );
}
