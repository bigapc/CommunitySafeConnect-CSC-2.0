import ResponderCard from "../components/responders/ResponderCard";
import { mockResponders } from "../data/mockResponders";

export default function ResponderVerification() {
  return (
    <div>
      <h2>Responder Verification</h2>
      {mockResponders.map((responder) => <ResponderCard key={responder.id} responder={responder} />)}
    </div>
  );
}
