import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types"; // 導入 PropTypes

const TodoList = ({ token }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(
          "https://todolist-api.hexschool.io/todos", // 確保使用正確的 API URL
          {
            headers: {
              Authorization: `Bearer ${token}`, // 確保這裡的 token 是有效的 JWT
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
        // 檢查是否有響應並顯示具體錯誤信息
        if (err.response) {
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

  if (loading) return <div>加載中...</div>;
  if (error) return <div>錯誤: {error.message}</div>;

  return (
    <div>
      <h1>待辦事項列表</h1>
      <ul>
        <li key={todo.id}>{todo.content}</li>
      </ul>
    </div>
  );
};

// 添加 PropTypes 驗證
TodoList.propTypes = {
  token: PropTypes.string.isRequired, // token 必須是字符串且是必需的
};

export default TodoList;
