import { DataTypes } from 'sequelize';
import type { QueryInterface } from 'sequelize';

export async function up( queryInterface: QueryInterface ){
  await queryInterface.createTable('AccCategs', {
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
        isIn: [['Capital', 'Revenue/Gain', 'Asset', 'Expense/Loss', 'Liability']],
        msg: 'Name must be Capital / Revenue/Gain / Asset / Expense/Loss / Liability',
      },
    },
    debitCreditRule: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['Debit the increase and credit the decrease', 'Debit the decrease and credit the increase']],
        msg: 'DebitCreditRule must be Debit the increase and credit the decrease / Debit the decrease and credit the increase',
      },
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
  await queryInterface.dropTable('AccCategs');
};
