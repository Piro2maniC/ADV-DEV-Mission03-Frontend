import "./App.css";
import { Routes, Route } from "react-router-dom";
import LayoutHome from "./common/Layout-Home/LayoutHomePage";
import HomePage from "./pages/HomePage/HomePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LayoutHome />}>
        <Route index element={<HomePage />} />
        <Route path="home" element={<HomePage />} />
      </Route>
    </Routes>
  );
}

export default App;
