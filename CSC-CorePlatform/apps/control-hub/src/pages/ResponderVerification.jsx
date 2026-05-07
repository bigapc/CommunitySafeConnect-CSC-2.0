import ResponderCard from "../components/responders/ResponderCard";
import { queueIntegrationEvent } from "../../../../shared/utils/integrationBridge";

export default function ResponderVerification({ responders = [], setResponders, showModal, user }) {
  const setResponderStatus = (responder, status) => {
    setResponders((prev) =>
      prev.map((item) =>
        item.id === responder.id
          ? {
              ...item,
              status,
              lastSeen: "just now",
            }
          : item
      )
    );
    queueIntegrationEvent({
      sourceApp: "control-hub",
      entityType: "responders",
      action: "responder.status_updated",
      entityId: responder.id,
      payload: { status, name: responder.name },
      sourceUser: user,
    });
  };

  return (
    <div>
      <h2>Responder Verification</h2>
      {responders.map((responder) => (
        <ResponderCard
          key={responder.id}
          responder={responder}
          onVerify={() => setResponderStatus(responder, "verified")}
          onSuspend={() => {
            showModal(
              "Suspend Responder",
              <p style={{ color: "var(--hub-muted)" }}>Suspend {responder.name} from active dispatch rotations?</p>,
              [
                { label: "Cancel", primary: false },
                {
                  label: "Suspend",
                  primary: true,
                  onClick: () => setResponderStatus(responder, "suspended"),
                },
              ]
            );
          }}
        />
      ))}
    </div>
  );
}
