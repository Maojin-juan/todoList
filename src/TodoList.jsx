import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types"; // 導入 PropTypes

const isValidToken = (token) => {
  const parts = token.split(".");
  return parts.length === 3; // JWT 應該有三部分
};

const TodoList = ({ token }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTodo, setNewTodo] = useState(""); // 用於新增待辦事項的狀態

  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true); // 開始加載
      console.log("獲取的 token:", token); // 打印 token

      // 檢查 token 格式
      if (!isValidToken(token)) {
        setError(new Error("無效的 token 格式")); // 顯示錯誤信息
        setLoading(false); // 加載完成
        return; // 退出函數
      }

      try {
        const response = await axios.get(
          "https://todolist-api.hexschool.io/todos", // 確保使用正確的 API URL
          {
            headers: {
              Authorization: token, // 使用 Bearer token
            },
          },
        );

        if (response.data.status) {
          // 檢查返回的狀態
          setTodos(response.data.data); // 更新狀態以儲存獲取的待辦事項
        } else {
          setError(new Error(response.data.message.join(", "))); // 顯示錯誤信息
        }
      } catch (err) {
        if (err.response) {
          console.error("錯誤詳情:", err.response.data); // 打印錯誤詳情
          setError(
            new Error(
              `${err.response.data.message.join(", ")}; 獲取的 token: ${token}`,
            ),
          ); // 顯示 API 返回的錯誤信息和獲取的 token
        } else {
          setError(err); // 如果沒有響應，顯示一般錯誤
        }
      } finally {
        setLoading(false); // 加載完成
      }
    };

    fetchTodos(); // 調用函數
  }, [token]);

  const addTodo = async () => {
    if (!newTodo) return; // 如果沒有輸入內容，則不執行
    try {
      const response = await axios.post(
        "https://todolist-api.hexschool.io/todos",
        { content: newTodo },
        {
          headers: {
            Authorization: token, // 使用 Bearer token
          },
        },
      );

      if (response.data.status) {
        // 確保返回的數據包含 content
        const newTodoItem = response.data.newTodo;
        if (newTodoItem && newTodoItem.content) {
          setTodos([...todos, newTodoItem]); // 更新待辦事項列表
          setNewTodo(""); // 清空輸入框
        } else {
          setError(new Error("新增待辦事項失敗，返回的數據格式不正確。"));
        }
      } else {
        setError(new Error(response.data.message.join(", "))); // 顯示錯誤信息
      }
    } catch (err) {
      setError(err);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      addTodo(); // 當按下 Enter 鍵時，執行新增待辦事項
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await axios.delete(
        `https://todolist-api.hexschool.io/todos/${id}`,
        {
          headers: {
            Authorization: token, // 使用 Bearer token
          },
        },
      );
      if (response.data.status) {
        setTodos(todos.filter((todo) => todo.id !== id)); // 更新待辦事項列表
      } else {
        setError(new Error(response.data.message.join(", "))); // 顯示錯誤信息
      }
    } catch (err) {
      setError(err);
    }
  };

  const editTodo = async (id) => {
    const newContent = prompt("請輸入新的待辦事項內容");
    if (!newContent) return; // 如果沒有輸入內容，則不執行

    try {
      const response = await axios.put(
        `https://todolist-api.hexschool.io/todos/${id}`,
        { content: newContent },
        {
          headers: {
            Authorization: token, // 使用 Bearer token
          },
        },
      );
      if (response.data.status) {
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, content: newContent } : todo,
          ),
        ); // 更新待辦事項列表
      } else {
        setError(new Error(response.data.message.join(", "))); // 顯示錯誤信息
      }
    } catch (err) {
      setError(err);
    }
  };

  if (loading) return <div>加載中...</div>;
  if (error) return <div>錯誤: {error.message}</div>;

  return (
    <div className="flex flex-col gap-y-4">
      <h1>待辦事項列表</h1>
      <input
        className="rounded-md border border-gray-300 p-2"
        type="text"
        placeholder="新增待辦事項"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)} // 更新狀態
        onKeyDown={handleKeyDown} // 監聽鍵盤事件
      />
      <button onClick={addTodo}>新增</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.content}
            <button onClick={() => editTodo(todo.id)}>編輯</button>
            <button onClick={() => deleteTodo(todo.id)}>刪除</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// 添加 PropTypes 驗證
TodoList.propTypes = {
  token: PropTypes.string.isRequired, // token 必須是字符串且是必需的
};

export default TodoList;
