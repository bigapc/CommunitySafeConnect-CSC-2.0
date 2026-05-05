import { useState } from "react";

export default function AddContactForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    phone: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone) {
      alert("Please fill in all fields");
      return;
    }
    onSubmit(formData);
    setFormData({ name: "", relationship: "", phone: "" });
  };

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: "block", color: "var(--navy)", fontWeight: 600, marginBottom: 6 }}>
          Contact Name
        </label>
        <input
          type="text"
          placeholder="e.g., Sarah Johnson"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          style={{
            width: "100%",
            border: "1px solid var(--line)",
            borderRadius: 10,
            padding: 10,
            fontSize: 14,
            fontFamily: "inherit",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ display: "block", color: "var(--navy)", fontWeight: 600, marginBottom: 6 }}>
          Relationship
        </label>
        <select
          value={formData.relationship}
          onChange={(e) => handleChange("relationship", e.target.value)}
          style={{
            width: "100%",
            border: "1px solid var(--line)",
            borderRadius: 10,
            padding: 10,
            fontSize: 14,
            fontFamily: "inherit",
            boxSizing: "border-box",
          }}
        >
          <option value="">Select relationship</option>
          <option value="Family">Family</option>
          <option value="Friend">Friend</option>
          <option value="Neighbor">Neighbor</option>
          <option value="Colleague">Colleague</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", color: "var(--navy)", fontWeight: 600, marginBottom: 6 }}>
          Phone Number
        </label>
        <input
          type="tel"
          placeholder="e.g., (555) 123-4567"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          style={{
            width: "100%",
            border: "1px solid var(--line)",
            borderRadius: 10,
            padding: 10,
            fontSize: 14,
            fontFamily: "inherit",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <button
          onClick={onCancel}
          style={{
            border: 0,
            borderRadius: 10,
            padding: 10,
            background: "var(--bg-soft)",
            color: "var(--navy)",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          style={{
            border: 0,
            borderRadius: 10,
            padding: 10,
            background: "var(--navy)",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Add Contact
        </button>
      </div>
    </div>
  );
}
