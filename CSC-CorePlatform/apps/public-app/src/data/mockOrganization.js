export const mockOrganization = {
  id: "org-001",
  name: "Northside Charter Academy",
  type: "School",
  status: "active",
  coordinator: "A. Coleman",
  announcements: [
    { id: "a-1", title: "Safety update", message: "Campus perimeter check completed.", date: "Today" },
  ],
  tasks: [
    { id: "t-1", title: "Review updated safety guide", status: "Pending" },
    { id: "t-2", title: "Confirm drill participation", status: "Completed" },
  ],
  debriefs: [
    { id: "d-1", title: "After-hours access review", summary: "Read-only incident debrief available." },
  ],
};
