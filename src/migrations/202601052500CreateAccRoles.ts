import { DataTypes } from 'sequelize';
import type { QueryInterface } from 'sequelize';

export async function up( queryInterface: QueryInterface ){
  await queryInterface.createTable('AccRoles', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    AccountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    RoleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
  await queryInterface.dropTable('AccRoles');
};
