import { useState, useEffect } from "react";

export function useExpiredCount() {
  const [expiredCount, setExpiredCount] = useState(0);

  useEffect(() => {
    // temporary data (replace with API later)
    setExpiredCount(1);
  }, []);

  return expiredCount;
}