import { useCallback, useEffect, useRef, useState } from "react";
import CurrentTime from "./CurrentTime";
import "./AOD.css";

const msgOn = "AOD is ON";
const msgOff = "AOD is OFF";

export default function AlwaysOnDisplay() {
  const wakeLockRef = useRef(null);
  const [isSupported, setIsSupported] = useState(false);
  const [wakeLockMsg, setWakeLockMsg] = useState(msgOff);
  const [wakeLockStatus, setWakeLockStatus] = useState(false);
  const [shouldReaquireWakeLock, setShouldReaquireWakeLock] = useState(false);

  const startTimeRef = useRef(0);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    let id;

    if (wakeLockRef.current && wakeLockStatus) {
      id = setInterval(() => {
        setTimeSpent(((Date.now() - startTimeRef.current) / 1000).toFixed(0));
      }, 1000);
    }

    return () => {
      if (id) clearInterval(id);
    };
  }, [wakeLockStatus]);

  const wakeSupportMessage = isSupported
    ? "AOD is supported"
    : "AOD is not supported";

  const handleWakeRequest = useCallback(async () => {
    if (!isSupported) return;
    try {
      wakeLockRef.current = await window.navigator.wakeLock.request("screen");
      setWakeLockMsg(msgOn);
      setWakeLockStatus(true);
      startTimeRef.current = Date.now();
    } catch (err) {
      setWakeLockMsg(`${err.name}, ${err.message}`);
      setWakeLockStatus(false);
    }
  }, [isSupported]);

  const handleWakeRelease = useCallback(async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
      startTimeRef.current = 0;
      setTimeSpent(0);
      setWakeLockMsg(msgOff);
      setWakeLockStatus(false);
    }
  }, []);

  useEffect(() => {
    const reaquire = localStorage.getItem("aod");
    if (reaquire === "true") setShouldReaquireWakeLock(true);
    else setShouldReaquireWakeLock(false);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        shouldReaquireWakeLock === true
      )
        handleWakeRequest();
      else handleWakeRelease();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    handleVisibilityChange();

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleWakeRelease, handleWakeRequest, shouldReaquireWakeLock]);

  useEffect(() => {
    if ("wakeLock" in navigator) setIsSupported(true);
    else setIsSupported(false);

    return () => {
      if (wakeLockRef.current)
        wakeLockRef.current.release().then(() => {
          wakeLockRef.current = null;
        });
    };
  }, []);

  const handleCheckboxChange = (checked) => {
    localStorage.setItem("aod", checked);
    setShouldReaquireWakeLock(checked);
  };

  return (
    <div className="container">
      <CurrentTime />

      {isSupported ? (
        <>
          <div style={{ fontWeight: "bold", padding: "20px 0px" }}>
            <label htmlFor="require-wake">
              You want to re-initiate AOD on focus?{" "}
            </label>
            <input
              id="require-wake"
              type="checkbox"
              checked={shouldReaquireWakeLock}
              onChange={() => handleCheckboxChange(!shouldReaquireWakeLock)}
            />
          </div>

          {wakeLockStatus === true ? (
            <button className="btn-off" onClick={handleWakeRelease}>
              Turn off AOD
            </button>
          ) : (
            <button className="btn-on" onClick={handleWakeRequest}>
              Turn on AOD
            </button>
          )}
          <h5>{wakeLockMsg}</h5>
          {wakeLockStatus && <p>AOD ON time {timeSpent}s</p>}
        </>
      ) : (
        <h4>{wakeSupportMessage}</h4>
      )}
    </div>
  );
}
