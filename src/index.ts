import 'reflect-metadata';
import app from './app';
import dotenv from 'dotenv';
dotenv.config();

import { sequelize } from './config/database'


const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.log('❌ Failed to start server:', error);
  }
}


startServer();
