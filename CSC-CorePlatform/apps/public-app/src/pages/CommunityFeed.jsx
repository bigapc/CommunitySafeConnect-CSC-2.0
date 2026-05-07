import { useState } from "react";
import SectionHeader from "../components/ui/SectionHeader";

const communityPosts = [
  {
    id: "post-1",
    author: "Sarah Johnson",
    timestamp: "2 hours ago",
    content: "New safe zone verified at Westville Community Center. Great for families.",
    likes: 24,
    comments: 3,
    type: "safe-zone",
  },
  {
    id: "post-2",
    author: "Mike Chen",
    timestamp: "4 hours ago",
    content: "Safety walking group organizing every Saturday. Join us at Main Park!",
    likes: 42,
    comments: 8,
    type: "community-event",
  },
  {
    id: "post-3",
    author: "Community Admin",
    timestamp: "Yesterday",
    content: "Extended hours for North District Safe Zone starting Monday. 24/7 access available.",
    likes: 67,
    comments: 12,
    type: "announcement",
  },
  {
    id: "post-4",
    author: "Lisa Park",
    timestamp: "Yesterday",
    content: "Thanks to all responders who helped during the drill. Great coordination!",
    likes: 53,
    comments: 15,
    type: "appreciation",
  },
];

export default function CommunityFeed({ onShowModal }) {
  const [filter, setFilter] = useState("all");
  const [liked, setLiked] = useState({});

  const postTypes = {
    "safe-zone": { label: "Safe Zones", color: "var(--green)" },
    "community-event": { label: "Events", color: "var(--blue)" },
    announcement: { label: "Announcements", color: "var(--navy)" },
    appreciation: { label: "Appreciation", color: "var(--accent)" },
  };

  const filteredPosts = filter === "all" ? communityPosts : communityPosts.filter((p) => p.type === filter);

  const handleLike = (postId) => {
    setLiked((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleComment = (post) => {
    onShowModal(
      `Reply to ${post.author}`,
      <div>
        <div style={{ marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--line)" }}>
          <p style={{ fontWeight: 600, color: "var(--navy)" }}>{post.content}</p>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 8 }}>{post.timestamp} • {post.author}</p>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: 600, color: "var(--navy)" }}>Your reply</label>
          <textarea
            placeholder="Share your thoughts..."
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid var(--line)",
              fontFamily: "inherit",
              minHeight: 80,
            }}
          />
        </div>
      </div>,
      [
        { label: "Cancel", primary: false },
        {
          label: "Post Reply",
          primary: true,
          onClick: () => {
            onShowModal(
              "Reply Posted",
              <div>
                <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
                <p style={{ color: "var(--muted)" }}>Your reply has been posted to the community.</p>
              </div>,
              [{ label: "Done", primary: true }]
            );
          },
        },
      ]
    );
  };

  return (
    <div>
      <SectionHeader title="Community Safety Feed" />

      <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 8 }}>
        <button
          onClick={() => setFilter("all")}
          style={{
            border: 0,
            borderRadius: 20,
            padding: "8px 14px",
            background: filter === "all" ? "var(--navy)" : "#fff",
            color: filter === "all" ? "#fff" : "var(--navy)",
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
            boxShadow: "var(--shadow)",
            fontSize: 13,
          }}
        >
          All Posts
        </button>
        {Object.entries(postTypes).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              border: 0,
              borderRadius: 20,
              padding: "8px 14px",
              background: filter === key ? "var(--navy)" : "#fff",
              color: filter === key ? "#fff" : "var(--navy)",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: "var(--shadow)",
              fontSize: 13,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {filteredPosts.map((post) => (
        <div key={post.id} style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "var(--shadow)", marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
            <div>
              <div style={{ fontWeight: 700, color: "var(--navy)" }}>{post.author}</div>
              <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 2 }}>{post.timestamp}</div>
            </div>
            <span
              style={{
                background: postTypes[post.type].color,
                color: "#fff",
                borderRadius: 12,
                padding: "4px 10px",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {postTypes[post.type].label}
            </span>
          </div>

          <p style={{ color: "var(--navy)", lineHeight: 1.6, marginBottom: 12 }}>{post.content}</p>

          <div
            style={{
              display: "flex",
              gap: 16,
              color: "var(--muted)",
              fontSize: 13,
              paddingTop: 12,
              borderTop: "1px solid var(--line)",
            }}
          >
            <button
              onClick={() => handleLike(post.id)}
              style={{
                background: "none",
                border: 0,
                cursor: "pointer",
                color: liked[post.id] ? "var(--accent)" : "var(--muted)",
                fontWeight: liked[post.id] ? 700 : 500,
              }}
            >
              {liked[post.id] ? "❤️" : "🤍"} {post.likes + (liked[post.id] ? 1 : 0)}
            </button>
            <button
              onClick={() => handleComment(post)}
              style={{
                background: "none",
                border: 0,
                cursor: "pointer",
                color: "var(--muted)",
              }}
            >
              💬 {post.comments}
            </button>
            <button
              style={{
                background: "none",
                border: 0,
                cursor: "pointer",
                color: "var(--muted)",
                marginLeft: "auto",
              }}
            >
              ⬆️ Share
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
