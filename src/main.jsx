import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 引入 BrowserRouter
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {" "}
    {/* 確保 App 被 BrowserRouter 包裹 */}
    <App />
  </BrowserRouter>,
);
