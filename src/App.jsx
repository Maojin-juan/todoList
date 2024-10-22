import React, { useState } from "react";
import {
  Route,
  Routes,
  Navigate,
  useNavigate, // 引入 useNavigate
} from "react-router-dom";
import axios from "axios";
import TodoList from "./TodoList"; // 假設你已經有 TodoList 組件
import "./App.css";

const App = () => {
  const [token, setToken] = useState(null); // 用來儲存 JWT Token
  const [error, setError] = useState(null); // 用來儲存錯誤信息
  const [activeTab, setActiveTab] = useState("login"); // 用來控制當前選中的選項卡

  // 預設的登入和註冊信息
  const defaultEmail = "example@gmail.com";
  const defaultPassword = "example";
  const defaultNickname = "毛巾捲";

  // 用於登入表單的狀態
  const [loginEmail, setLoginEmail] = useState(defaultEmail);
  const [loginPassword, setLoginPassword] = useState(defaultPassword);

  // 用於註冊表單的狀態
  const [registerNickname, setRegisterNickname] = useState(defaultNickname);
  const [registerEmail, setRegisterEmail] = useState(defaultEmail);
  const [registerPassword, setRegisterPassword] = useState(defaultPassword);

  const navigate = useNavigate(); // 使用 useNavigate 鉤子

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://todolist-api.hexschool.io/users/sign_in",
        {
          email: loginEmail,
          password: loginPassword,
        },
      );
      setToken(response.data.token); // 儲存 Token
      setError(null); // 清除錯誤
      navigate("/todolist"); // 登入成功後跳轉到 /todolist
    } catch (err) {
      setError(err.response.data.message); // 設置錯誤信息
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post("https://todolist-api.hexschool.io/users/sign_up", {
        nickname: registerNickname, // 添加 nickname 欄位
        email: registerEmail,
        password: registerPassword,
      });
      alert("註冊成功！請登入。"); // 提示註冊成功
    } catch (err) {
      setError(err.response.data.message); // 設置錯誤信息
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-3xl font-bold">待辦事項應用</h1>
      {error && <div className="mb-4 text-red-500">{error}</div>}

      {/* 選項卡 */}
      <div className="mb-4">
        <button
          onClick={() => setActiveTab("login")}
          className={`mr-2 ${activeTab === "login" ? "font-bold" : ""}`}
        >
          登入
        </button>
        <button
          onClick={() => setActiveTab("register")}
          className={`${activeTab === "register" ? "font-bold" : ""}`}
        >
          註冊
        </button>
      </div>

      <Routes>
        <Route
          path="/todolist"
          element={token ? <TodoList token={token} /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={
            <div>
              {activeTab === "login" ? (
                <div className="mb-4 flex flex-col gap-y-4">
                  <h2>登入</h2>
                  <input
                    className="rounded-md border-2 p-2"
                    type="email"
                    placeholder="電子郵件"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)} // 更新狀態
                  />
                  <input
                    className="rounded-md border-2 p-2"
                    type="password"
                    placeholder="密碼"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)} // 更新狀態
                  />
                  <button onClick={handleLogin}>登入</button>
                </div>
              ) : (
                <div className="mb-4 flex flex-col gap-y-4">
                  <h2>註冊</h2>
                  <input
                    className="rounded-md border-2 p-2"
                    type="text"
                    placeholder="暱稱"
                    value={registerNickname}
                    onChange={(e) => setRegisterNickname(e.target.value)} // 更新狀態
                  />
                  <input
                    className="rounded-md border-2 p-2"
                    type="email"
                    placeholder="電子郵件"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)} // 更新狀態
                  />
                  <input
                    className="rounded-md border-2 p-2"
                    type="password"
                    placeholder="密碼"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)} // 更新狀態
                  />
                  <button onClick={handleRegister}>註冊</button>
                </div>
              )}
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
