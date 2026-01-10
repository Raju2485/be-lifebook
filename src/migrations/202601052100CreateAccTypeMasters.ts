import { DataTypes } from 'sequelize';
import type { QueryInterface } from 'sequelize';

export async function up( queryInterface: QueryInterface ){
  await queryInterface.createTable('AccTypeMasters', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isIn: [['personal', 'real', 'nominal']],
        message: 'Name must be one of the following: personal / real / nominal'
      }
    },
    goldenRule: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isIn: [['Debit the receiver, Credit the giver', 'Debit what comes in, Credit what goes out', 'Debit expenses and losses, Credit incomes and gains']],
        message: 'Golden rule must be one of the following: Debit the receiver, Credit the giver / Debit what comes in, Credit what goes out / Debit expenses and losses, Credit incomes and gains'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
  });
};

export async function down(queryInterface: QueryInterface ){
  await queryInterface.dropTable('AccTypeMasters');
};
