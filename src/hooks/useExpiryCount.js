import { useState, useEffect } from "react";

export function useExpiredCount() {
  const [expiredCount, setExpiredCount] = useState(0);

  useEffect(() => {
    setExpiredCount(1);
  }, []);

  return expiredCount;
}