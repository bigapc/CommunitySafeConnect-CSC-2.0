import OrganizationCard from "../components/organizations/OrganizationCard";
import { mockOrganizations } from "../data/mockOrganizations";

export default function Organizations() {
  return (
    <div>
      <h2>Organizations</h2>
      {mockOrganizations.map((org) => <OrganizationCard key={org.id} org={org} />)}
    </div>
  );
}
