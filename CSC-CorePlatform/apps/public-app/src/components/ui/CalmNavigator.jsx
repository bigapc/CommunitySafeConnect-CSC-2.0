import { useMemo, useState } from "react";

const calmScripts = {
  home: "You are connected and supported. If you need help, tap once and stay where you are if safe.",
  sos: "Stay calm. Your alert is active. Breathe slowly and follow the nearest safe guidance.",
  safezones: "Use verified safe zones nearby. Move steadily and keep your phone available.",
  circle: "Your trusted contacts are ready to help. Share your status clearly and calmly.",
  incidents: "Your incident records are preserved. For changes, contact the command center.",
  organization: "Organization updates are available. Follow official instructions in order.",
  settings: "Security controls are view focused. Deletion actions are not available in this app.",
  "control-hub": "Control hub access is restricted to authorized staff for calm coordinated response.",
};

function getVoice() {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((voice) => /female|zira|samantha|aria|susan|linda/i.test(voice.name)) ||
    voices.find((voice) => /en/i.test(voice.lang)) ||
    voices[0]
  );
}

export default function CalmNavigator({ route }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const message = useMemo(() => calmScripts[route] || calmScripts.home, [route]);

  const speakMessage = () => {
    if (!("speechSynthesis" in window)) return;

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.94;
    utterance.pitch = 0.92;
    utterance.volume = 1;
    const voice = getVoice();
    if (voice) utterance.voice = voice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      style={{
        position: "fixed",
        right: 14,
        bottom: 88,
        width: "min(320px, calc(100vw - 28px))",
        background: "linear-gradient(145deg, #ffffff, var(--bg-soft))",
        border: "1px solid var(--line)",
        borderRadius: 18,
        boxShadow: "var(--shadow)",
        padding: 14,
        zIndex: 5,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <div style={{ fontWeight: 800, color: "var(--navy)", fontSize: 14 }}>Calm Navigator</div>
          <div style={{ color: "var(--muted)", fontSize: 12 }}>Voice guidance for clear decision support</div>
        </div>
        <button
          onClick={speakMessage}
          style={{
            border: 0,
            borderRadius: 999,
            padding: "10px 12px",
            background: isSpeaking ? "var(--accent)" : "var(--navy)",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {isSpeaking ? "Speaking" : "Talk"}
        </button>
      </div>
      <p style={{ margin: "10px 0 0", color: "var(--muted)", fontSize: 13, lineHeight: 1.5 }}>{message}</p>
    </div>
  );
}
