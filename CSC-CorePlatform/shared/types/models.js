export const modelNotes = {
  profile: ["id", "full_name", "email", "phone", "role", "organization_id"],
  incident: ["id", "user_id", "organization_id", "incident_type", "status", "priority"],
  notification: ["id", "profile_id", "title", "message", "type", "is_read"],
  organization: ["id", "name", "type", "status", "coordinator", "member_count", "integration_status"],
  integration_event: ["id", "source_app", "entity_type", "action", "entity_id", "payload", "delivery", "webhook_target", "created_at"],
};
