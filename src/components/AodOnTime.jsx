import { useEffect, useRef, useState } from "react";

export default function AodOnTime() {
  const startTimeRef = useRef(parseInt(Date.now()));
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeSpent(parseInt((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => {
      if (id) clearInterval(id);
    };
  }, []);

  return (
    <p>
      AOD ON time{" "}
      <b>
        {parseInt(timeSpent / 3600) > 0 && parseInt(timeSpent / 3600) + "h "}
        {parseInt(timeSpent / 60) > 0 && parseInt((timeSpent / 60) % 60) + "m "}
        {timeSpent % 60}s
      </b>
    </p>
  );
}
