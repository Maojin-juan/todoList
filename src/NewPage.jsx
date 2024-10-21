// src/NewPage.jsx
import { useEffect, useState } from "react"; // 確保導入 React
import axios from "axios"; // 引入 Axios

const NewPage = () => {
  const [userData, setUserData] = useState(null); // 用於存儲用戶數據
  const [loading, setLoading] = useState(true); // 加載狀態

  useEffect(() => {
    // 發送請求以獲取隨機用戶數據
    axios
      .get("https://randomuser.me/api/?gender=female&nat=us")
      .then((response) => {
        setUserData(response.data.results[0]); // 獲取數據並設置狀態
        setLoading(false); // 設置加載狀態為 false
      })
      .catch((error) => {
        console.log(error);
        setLoading(false); // 設置加載狀態為 false
      });
  }, []); // 空依賴數組，確保只在組件掛載時發送請求

  if (loading) {
    return <div>加載中...</div>; // 加載時顯示的內容
  }

  return (
    <div>
      <h1>隨機用戶資料</h1>
      {userData ? (
        <div>
          <p>
            姓名: {userData.name.first} {userData.name.last}
          </p>
          <p>電子郵件: {userData.email}</p>
          <p>
            地址: {userData.location.city}, {userData.location.state}
          </p>
          <img src={userData.picture.large} alt="用戶圖片" />
        </div>
      ) : (
        <p>未能獲取用戶資料</p>
      )}
    </div>
  );
};

export default NewPage;
