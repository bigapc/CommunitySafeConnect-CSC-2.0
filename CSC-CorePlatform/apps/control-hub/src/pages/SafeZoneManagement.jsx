import ZoneRow from "../components/safezones/ZoneRow";
import { mockHubZones } from "../data/mockSafeZones";

export default function SafeZoneManagement() {
  return (
    <div>
      <h2>Safe Zone Management</h2>
      {mockHubZones.map((zone) => <ZoneRow key={zone.id} zone={zone} />)}
    </div>
  );
}
