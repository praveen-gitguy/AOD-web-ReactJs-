import "./App.css";
import useOnlineChecker from "./hooks/useOnlineChecker";
import AlwaysOnDisplay from "./components/AlwaysOnDisplay";

function App() {
  const [isOnline] = useOnlineChecker();

  return (
    <div>
      {!isOnline && <h1 className="online-status">You are offline</h1>}
      <AlwaysOnDisplay />
    </div>
  );
}

export default App;
