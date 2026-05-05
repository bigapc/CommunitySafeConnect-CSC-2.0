import SectionHeader from "../components/ui/SectionHeader";
import SafeZoneCard from "../components/map/SafeZoneCard";
import { mockSafeZones } from "../data/mockSafeZones";

export default function SafeZones() {
  return (
    <div>
      <SectionHeader title="Verified Safe Zones" />
      <div style={{ background: "linear-gradient(180deg,#dce7f4,#edf3f9)", borderRadius: 24, minHeight: 180, marginBottom: 16, display: "grid", placeItems: "center", color: "var(--navy-2)", fontWeight: 700 }}>
        Map preview placeholder
      </div>
      {mockSafeZones.map((zone) => <SafeZoneCard key={zone.id} zone={zone} />)}
    </div>
  );
}
