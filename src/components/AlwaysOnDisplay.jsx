import { useEffect, useRef, useState } from "react";
import CurrentTime from "./CurrentTime";
import "./AOD.css";

const msgOn = "AOD is ON";
const msgOff = "AOD is OFF";

export default function AlwaysOnDisplay() {
  const wakeLockRef = useRef(null);
  const [isSupported, setIsSupported] = useState(false);
  const [wakeLockMsg, setWakeLockMsg] = useState(msgOff);
  const [wakeLockStatus, setWakeLockStatus] = useState(false);

  const wakeSupportMessage = isSupported
    ? "AOD is supported"
    : "AOD is not supported";

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

  const handleWakeRequest = async () => {
    if (!isSupported) return;
    try {
      wakeLockRef.current = await window.navigator.wakeLock.request("screen");
      setWakeLockMsg(msgOn);
      setWakeLockStatus(true);
    } catch (err) {
      console.log(err);
      setWakeLockMsg(`${err.name}, ${err.message}`);
      setWakeLockStatus(false);
    }
  };

  const handleWakeRelease = async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
      setWakeLockMsg(msgOff);
      setWakeLockStatus(false);
    }
  };

  return (
    <div className="container">
      <CurrentTime />
      <h4>{wakeSupportMessage}</h4>

      {isSupported && (
        <>
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
        </>
      )}
    </div>
  );
}
