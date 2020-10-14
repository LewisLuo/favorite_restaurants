# 餐廳筆記
1. 可以在首頁觀看所有餐廳的簡易訊息包括：照片、名稱、分類、評分。

2. 可以點擊餐廳區塊，觀看詳細資訊包括：類別、地址、電話、描述、圖片。

3. 可以透過搜尋關鍵字查找餐廳名稱，除中文名稱外亦可使用英文名稱搜尋。

4. 可以新增、修改、刪除每筆餐廳資料

5. 可以利用「排序」選單餐廳將列表依照選項排序

6. 新增或修改表單時，可以預覽確認送出內容

# 開發使用的軟體與套件
1. VS code
2. Node.js v10.15.0
3. Nodemon v2.0.4
4. Express v4.17.1
5. Express-handlebars v5.1.0
6. Body-parser v1.19.0
7. Method-override v3.0.0
8. Mongoose v5.10.7
9. Bootstrap v4.5.2 (note: v4.5.3以上會導致下拉清單無法顯示)
10. Font Awesome Free v5.14.0

# 安裝流程
1. 於terminal中輸入複製專案到電腦中。<br>
<code>$ git clone https://github.com/LewisLuo/favorite_restaurants</code>
2. 進入專案資料夾中使用npm安裝套件。<br>
<code>$ cd favorite_restaurants</code><br>
<code>$ npm init</code>
3. 使用node.js或nodemon開啟本機伺服器。<br>
<code>$ node app.js</code>
4. 成功開啟時終端機會傳入以下訊息。<br>
<code>Express server is running on http://localhost:3000</code>