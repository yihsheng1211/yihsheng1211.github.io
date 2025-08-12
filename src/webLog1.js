    // 在這裡替換成你部署 Apps Script 後獲得的網頁應用程式 URL
    const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycby8sTL1cY59QhuTleoKoo2Sq7r11dm1a8JsXb-kOKipxXly5dTT9YNoAivYO88ES7d8vg/exec";

    /**
     * 使用一個公共 API 來獲取使用者的 IP 位址
     * @returns {Promise<string>} 返回一個包含 IP 位址的 Promise
     */
    async function getIpAddress() {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
      } catch (error) {
        console.error('無法獲取 IP 位址:', error);
        return '未知 IP';
      }
    }

    /**
     * 記錄訪問者資訊到 Google Apps Script 後端
     */
    async function recordVisitor(inlatitude,inlongitude) {
      const ipAddress = await getIpAddress();
      const userAgent = navigator.userAgent; // 獲取使用者代理字串
      const timestamp = new Date().toISOString(); // ISO 格式的時間戳
      const pathname = window.location.pathname;
      const referrer = pathname.substring(pathname.lastIndexOf('/') + 1) || '直接訪問'; // 新增獲取來源網頁

      // 準備要發送到 Apps Script 的資料
      const formData = new FormData();
      formData.append('ipAddress', ipAddress);
      formData.append('userAgent', userAgent);
      formData.append('timestamp', timestamp);
      formData.append('referrer', referrer); // 新增來源網頁欄位   
      if (inlatitude != null) formData.append('inlatitude', inlatitude);
      if (inlongitude != null) formData.append('inlongitude', inlongitude);
      
      try {
        const response = await fetch(GAS_WEB_APP_URL, {
          method: 'POST',
          body: formData,
          // Apps Script 會自動處理 FormData，所以我們不需要設定 Content-Type
        });

        if (response.ok) {
          const result = await response.json();
          console.log('記錄成功:', result);
        } else {
          console.error('記錄失敗，HTTP 狀態碼:', response.status);
        }
      } catch (error) {
        console.error('發送請求到 Apps Script 時發生錯誤:', error);
      }
    }

    // 當 DOM 內容載入完成時，執行記錄函式
    document.addEventListener('DOMContentLoaded', () => {
      recordVisitor(null,null);
    });
