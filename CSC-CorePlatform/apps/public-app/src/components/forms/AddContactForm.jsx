import { useEffect, useState } from "react";

const emptyForm = {
  name: "",
  relationship: "",
  phone: "",
  priority: "normal",
};

export default function AddContactForm({ onSubmit, onCancel, initialData, submitLabel = "Add Contact" }) {
  const [formData, setFormData] = useState(initialData || emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData(initialData || emptyForm);
    setError("");
  }, [initialData]);

  const handleChange = (field, value) => {
    setError("");
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError("Please add at least a contact name and phone number.");
      return;
    }
    onSubmit({
      name: formData.name.trim(),
      relationship: formData.relationship || "Other",
      phone: formData.phone.trim(),
      priority: formData.priority || "normal",
    });
    setFormData(emptyForm);
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
          Category
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
          <option value="">Select category</option>
          <option value="Family">Family</option>
          <option value="Friend">Friend</option>
          <option value="Neighbor">Neighbor</option>
          <option value="Medical">Medical</option>
          <option value="Mental Health">Mental Health</option>
          <option value="Emergency Services">Emergency Services</option>
          <option value="Law Enforcement">Law Enforcement</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ display: "block", color: "var(--navy)", fontWeight: 600, marginBottom: 6 }}>
          Priority
        </label>
        <select
          value={formData.priority}
          onChange={(e) => handleChange("priority", e.target.value)}
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
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
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

      {error ? (
        <p style={{ color: "#c62828", fontSize: 13, marginTop: -8, marginBottom: 16 }}>{error}</p>
      ) : null}

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
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
