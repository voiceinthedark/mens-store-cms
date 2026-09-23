import { useState } from "react";
import { DashboardPage } from "./pages/Dashboard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <DashboardPage />
    </>
  );
}

export default App;
