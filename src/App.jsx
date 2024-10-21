import React, { useState } from "react";
import NewPage from "./NewPage"; // 引入 NewPage
import "./App.css";

const App = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // 新增狀態管理當前選中的選項卡
  const [showNewPage, setShowNewPage] = useState(false); // 新增狀態控制顯示 NewPage
  const [isDarkMode, setIsDarkMode] = useState(false); // 新增狀態控制主題顏色

  const handleInputChange = (e) => {
    setTask(e.target.value);
  };

  const handleAddTask = () => {
    if (task.trim() === "") return; // 不允許添加空任務
    setTasks([...tasks, { text: task, completed: false }]);
    setTask(""); // 清空輸入框
  };

  const handleDeleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const handleToggleTask = (index) => {
    const newTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  // 根據當前選中的選項卡過濾任務
  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "completed") return task.completed;
    if (activeTab === "incomplete") return !task.completed;
    return true; // 'all' 選項卡顯示所有任務
  });

  // 切換主題顏色
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen  ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <h1 className="text-3xl font-bold mb-4">To-Do List</h1>

      {/* 切換主題的按鈕 */}
      <button
        onClick={toggleTheme}
        className="mb-4 bg-yellow-500 text-white rounded-md p-2 hover:bg-yellow-600"
      >
        {isDarkMode ? "切換到白色模式" : "切換到黑色模式"}
      </button>

      {/* 跳轉到新頁面的按鈕 */}
      <button
        onClick={() => setShowNewPage(!showNewPage)}
        className="mb-4 bg-green-500 text-white rounded-md p-2 hover:bg-green-600"
      >
        {showNewPage ? "返回主頁" : "前往新頁面"}
      </button>

      {showNewPage ? ( // 根據狀態顯示 NewPage 或主頁內容
        <NewPage />
      ) : (
        <>
          {/* 選項卡 UI */}
          <div className="mb-4">
            <button
              onClick={() => setActiveTab("all")}
              className={`mr-2 ${activeTab === "all" ? "font-bold" : ""}`}
            >
              全部
            </button>
            <button
              onClick={() => setActiveTab("incomplete")}
              className={`mr-2 ${
                activeTab === "incomplete" ? "font-bold" : ""
              }`}
            >
              待完成
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`${activeTab === "completed" ? "font-bold" : ""}`}
            >
              已完成
            </button>
          </div>

          <div className="flex mb-4">
            <input
              type="text"
              value={task}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress} // 監聽 Enter 鍵
              placeholder="輸入任務..."
              className="border border-gray-300 rounded-l-md p-2 w-64"
            />
            <button
              onClick={handleAddTask}
              className="bg-blue-500 text-white rounded-r-md p-2 hover:bg-blue-600"
            >
              添加任務
            </button>
          </div>

          <ul className="w-64">
            {filteredTasks.map((task, index) => (
              <li
                key={index}
                className="flex justify-between items-center border border-gray-300 rounded-md p-2 mb-2"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(index)} // 點擊 checkbox 切換完成狀態
                    className="mr-2 cursor-pointer"
                  />
                  <span
                    className={`${
                      task.completed ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {task.text}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteTask(index)}
                  className="bg-red-500 text-white rounded-md px-2 hover:bg-red-600"
                >
                  刪除
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default App;
