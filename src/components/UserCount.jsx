import { useEffect, useState } from "react";
import { subscribeToUserCount, trackUniqueVisitor } from "../lib/userCount.js";

export default function UserCount() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const unsub = subscribeToUserCount(setCount);
    trackUniqueVisitor().catch((err) => {
      console.error("Failed to track unique visitor:", err);
    });
    return unsub;
  }, []);

  if (count == null) return null;

  return <span className="footer-user-count">{count}</span>;
}
