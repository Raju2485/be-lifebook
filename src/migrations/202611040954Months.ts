import { DataTypes } from 'sequelize';
import type { QueryInterface } from 'sequelize';

export async function up( queryInterface: QueryInterface ){
  await queryInterface.createTable('Months', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['months', 'quarters']],
        msg: 'Type must be months / quarters',
      },
    },
    sequence: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    },
    fromDate: {
      type: DataTypes.DATE,
    },
    toDate: {
      type: DataTypes.DATE,
    },
    fromMonthNum: {
      type: DataTypes.INTEGER,
    },
    toMonthNum: {
      type: DataTypes.INTEGER,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });
};

export async function down(queryInterface: QueryInterface ){
  await queryInterface.dropTable('Months');
};
