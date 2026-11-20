import { DataTypes } from 'sequelize';
import type { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('Accounts', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    UserId: {
      type: DataTypes.INTEGER,
    },
    OrgId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    AccCategsM_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isClosed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    natureOfAccount: {
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [['Cash', 'Bank', null]],
          msg: 'natureOfAccount must be one of the following: Cash / Bank/ null',
        },
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

  await queryInterface.addConstraint('Accounts', {
    fields: ['OrgId', 'name'],
    type: 'unique',
    name: 'Accounts_OrgId_name_uk',
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('Accounts');
}
