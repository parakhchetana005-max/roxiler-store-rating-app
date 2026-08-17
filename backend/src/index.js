import app from './app.js';
import sequelize from './config/database.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3001;

sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Database connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Unable to connect to database:', err.message);
    process.exit(1);
  });
