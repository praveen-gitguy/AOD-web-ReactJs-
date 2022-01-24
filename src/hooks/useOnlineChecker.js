import { useEffect, useState } from "react";

export default function useOnlineChecker() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const helper = () => {
      setIsOnline(navigator.onLine);
    };

    helper();

    window.addEventListener("online", helper);
    window.addEventListener("offline", helper);

    return () => {
      window.removeEventListener("online", helper);
      window.removeEventListener("offline", helper);
    };
  }, []);

  return [isOnline];
}
