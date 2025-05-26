// server.js
const app = require('./app');
const { sequelize } = require('./models');
const PORT = process.env.PORT || 5000;

sequelize.sync() // Tự tạo bảng
  .then(() => {
    console.log('✅ Database synced');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('❌ Error syncing DB:', err));


