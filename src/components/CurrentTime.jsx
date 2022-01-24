import { useEffect, useState } from "react";

export default function CurrentTime() {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleString("en-IN", { hour12: true })
  );
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleString("en-IN", { hour12: true }));
    }, 1000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        width: "100%",
      }}
    >
      {currentTime.split(",").map((el, idx) => (
        <div key={`time-${idx}`}>
          <h3>{el}</h3>
        </div>
      ))}
    </div>
  );
}
