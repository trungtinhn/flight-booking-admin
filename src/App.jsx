import "./App.css";
import useRouteElements from "./hooks/useRouteElements";

function App() {
  const routeElements = useRouteElements();

  return <>{routeElements}</>;
}

export default App;
