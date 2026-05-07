import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import SectionHeader from "../components/ui/SectionHeader";

const FEED_STORAGE_KEY = "csc-community-feed-v1";

const SEED_POSTS = [
  {
    id: "post-seed-1",
    authorId: "system",
    author: "Community Admin",
    avatar: "CA",
    content: "New safe zone verified at Westville Community Center. Great for families.",
    likes: 24,
    likedBy: [],
    comments: [
      { id: "c1", author: "Sarah J.", text: "Great news! My kids go there.", createdAt: "2026-05-05T10:00:00Z" },
      { id: "c2", author: "Mike C.", text: "Very needed in that area.", createdAt: "2026-05-05T10:15:00Z" },
    ],
    type: "safe-zone",
    createdAt: "2026-05-05T09:00:00Z",
  },
  {
    id: "post-seed-2",
    authorId: "system",
    author: "Mike Chen",
    avatar: "MC",
    content: "Safety walking group organizing every Saturday 8am. Meet at Main Park! All welcome.",
    likes: 42,
    likedBy: [],
    comments: [
      { id: "c3", author: "Lisa P.", text: "I'll be there Saturday!", createdAt: "2026-05-04T14:00:00Z" },
    ],
    type: "community-event",
    createdAt: "2026-05-04T13:00:00Z",
  },
  {
    id: "post-seed-3",
    authorId: "system",
    author: "Community Admin",
    avatar: "CA",
    content: "Extended hours for North District Safe Zone starting Monday. 24/7 access now available.",
    likes: 67,
    likedBy: [],
    comments: [],
    type: "announcement",
    createdAt: "2026-05-03T08:00:00Z",
  },
  {
    id: "post-seed-4",
    authorId: "system",
    author: "Lisa Park",
    avatar: "LP",
    content: "Thanks to all responders who helped during the community drill. Amazing coordination by everyone!",
    likes: 53,
    likedBy: [],
    comments: [],
    type: "appreciation",
    createdAt: "2026-05-02T17:00:00Z",
  },
];

const POST_TYPES = {
  "safe-zone": { label: "Safe Zone", color: "#16a34a" },
  "community-event": { label: "Event", color: "#1d4ed8" },
  announcement: { label: "Announcement", color: "var(--navy)" },
  appreciation: { label: "Appreciation", color: "#b45309" },
  general: { label: "General", color: "var(--muted)" },
};

function loadFeed() {
  try {
    const raw = localStorage.getItem(FEED_STORAGE_KEY);
    if (!raw) return SEED_POSTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_POSTS;
  } catch {
    return SEED_POSTS;
  }
}

function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function CommunityFeed({ onShowModal, user: userProp }) {
  const { user: authUser } = useAuth();
  const currentUser = userProp || authUser;

  const [posts, setPosts] = useState(loadFeed);
  const [filter, setFilter] = useState("all");
  const [composing, setComposing] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newType, setNewType] = useState("general");
  const [commentDraft, setCommentDraft] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const composeRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(FEED_STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  const filteredPosts = filter === "all" ? posts : posts.filter((p) => p.type === filter);

  const handleLike = (postId) => {
    const uid = currentUser?.id || "guest";
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const already = (p.likedBy || []).includes(uid);
        return {
          ...p,
          likes: already ? p.likes - 1 : p.likes + 1,
          likedBy: already ? (p.likedBy || []).filter((id) => id !== uid) : [...(p.likedBy || []), uid],
        };
      })
    );
  };

  const handleAddComment = (postId) => {
    const text = (commentDraft[postId] || "").trim();
    if (!text) return;
    const comment = {
      id: `c-${Date.now()}`,
      author: currentUser?.fullName || "Anonymous",
      text,
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, comment] } : p))
    );
    setCommentDraft((prev) => ({ ...prev, [postId]: "" }));
  };

  const handleCreatePost = () => {
    if (!newContent.trim()) return;
    const post = {
      id: `post-${Date.now()}`,
      authorId: currentUser?.id || "guest",
      author: currentUser?.fullName || "Anonymous",
      avatar: currentUser?.avatar || "?",
      content: newContent.trim(),
      likes: 0,
      likedBy: [],
      comments: [],
      type: newType,
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) => [post, ...prev]);
    setNewContent("");
    setNewType("general");
    setComposing(false);
  };

  return (
    <div>
      <SectionHeader title="Community Safety Feed" />

      {/* Compose button */}
      {!composing && (
        <button
          onClick={() => { setComposing(true); setTimeout(() => composeRef.current?.focus(), 50); }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            width: "100%",
            background: "#fff",
            border: "1px solid var(--line)",
            borderRadius: 14,
            padding: "12px 16px",
            marginBottom: 16,
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 18, background: "var(--navy)", display: "grid", placeItems: "center", color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
            {currentUser?.avatar || "?"}
          </div>
          <span style={{ color: "var(--muted)", fontSize: 14 }}>Share a community update…</span>
        </button>
      )}

      {/* Compose form */}
      {composing && (
        <div style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "var(--shadow)", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: "var(--navy)", display: "grid", placeItems: "center", color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
              {currentUser?.avatar || "?"}
            </div>
            <span style={{ fontWeight: 700, color: "var(--navy)" }}>{currentUser?.fullName || "You"}</span>
          </div>
          <textarea
            ref={composeRef}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="What's happening in your community?"
            rows={3}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--line)", fontFamily: "inherit", fontSize: 14, boxSizing: "border-box", resize: "vertical", marginBottom: 12 }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              style={{ flex: 1, padding: "8px 10px", borderRadius: 10, border: "1px solid var(--line)", fontFamily: "inherit", fontSize: 13 }}
            >
              {Object.entries(POST_TYPES).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <button onClick={() => setComposing(false)} style={{ border: "1px solid var(--line)", borderRadius: 10, padding: "8px 14px", background: "#fff", cursor: "pointer", fontWeight: 600, color: "var(--navy)", fontSize: 13 }}>Cancel</button>
            <button onClick={handleCreatePost} disabled={!newContent.trim()} style={{ border: 0, borderRadius: 10, padding: "8px 18px", background: newContent.trim() ? "var(--navy)" : "var(--line)", color: "#fff", fontWeight: 700, cursor: newContent.trim() ? "pointer" : "default", fontSize: 13 }}>Post</button>
          </div>
        </div>
      )}

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {["all", ...Object.keys(POST_TYPES)].map((key) => (
          <button key={key} onClick={() => setFilter(key)} style={{ border: 0, borderRadius: 20, padding: "7px 14px", background: filter === key ? "var(--navy)" : "#fff", color: filter === key ? "#fff" : "var(--navy)", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", boxShadow: "var(--shadow)", fontSize: 13, flexShrink: 0 }}>
            {key === "all" ? "All Posts" : POST_TYPES[key].label}
          </button>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <p style={{ color: "var(--muted)", textAlign: "center", padding: "32px 0" }}>No posts in this category yet.</p>
      )}

      {filteredPosts.map((post) => {
        const uid = currentUser?.id || "guest";
        const isLiked = (post.likedBy || []).includes(uid);
        const typeInfo = POST_TYPES[post.type] || POST_TYPES.general;
        const showComments = expandedComments[post.id];

        return (
          <div key={post.id} style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "var(--shadow)", marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 18, background: "var(--navy)", display: "grid", placeItems: "center", color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                  {post.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "var(--navy)", fontSize: 14 }}>{post.author}</div>
                  <div style={{ color: "var(--muted)", fontSize: 11 }}>{timeAgo(post.createdAt)}</div>
                </div>
              </div>
              <span style={{ background: typeInfo.color, color: "#fff", borderRadius: 12, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
                {typeInfo.label}
              </span>
            </div>

            <p style={{ color: "var(--navy)", lineHeight: 1.6, margin: "0 0 12px" }}>{post.content}</p>

            <div style={{ display: "flex", gap: 16, paddingTop: 10, borderTop: "1px solid var(--line)" }}>
              <button onClick={() => handleLike(post.id)} style={{ background: "none", border: 0, cursor: "pointer", color: isLiked ? "#e53e3e" : "var(--muted)", fontWeight: isLiked ? 700 : 400, padding: 0, fontSize: 13 }}>
                {isLiked ? "❤️" : "🤍"} {post.likes}
              </button>
              <button onClick={() => setExpandedComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))} style={{ background: "none", border: 0, cursor: "pointer", color: "var(--muted)", padding: 0, fontSize: 13 }}>
                💬 {post.comments.length}
              </button>
            </div>

            {showComments && (
              <div style={{ marginTop: 12 }}>
                {post.comments.map((c) => (
                  <div key={c.id} style={{ background: "var(--bg)", borderRadius: 10, padding: "8px 12px", marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, color: "var(--navy)", fontSize: 13 }}>{c.author}: </span>
                    <span style={{ color: "var(--navy)", fontSize: 13 }}>{c.text}</span>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <input
                    value={commentDraft[post.id] || ""}
                    onChange={(e) => setCommentDraft((prev) => ({ ...prev, [post.id]: e.target.value }))}
                    placeholder="Write a reply…"
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.id)}
                    style={{ flex: 1, padding: "8px 12px", borderRadius: 10, border: "1px solid var(--line)", fontFamily: "inherit", fontSize: 13 }}
                  />
                  <button onClick={() => handleAddComment(post.id)} style={{ border: 0, borderRadius: 10, padding: "8px 14px", background: "var(--navy)", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Reply</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
