/** Normalize id for reliable online checks (socket query ids are always strings). */
export function toId(value) {
  if (value == null) return "";
  if (typeof value === "object" && value._id != null) return String(value._id);
  return String(value);
}

export function isUserOnline(onlineUsers, userId) {
  const id = toId(userId);
  if (!id) return false;
  const list = Array.isArray(onlineUsers) ? onlineUsers : [];
  return list.map(toId).includes(id);
}
