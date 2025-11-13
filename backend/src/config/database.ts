import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://calcuser:calcpass@localhost:5432/calctree';

export const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database models synchronized.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};
