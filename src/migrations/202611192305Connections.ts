import { DataTypes } from 'sequelize';
import type { QueryInterface } from 'sequelize';

export async function up( queryInterface: QueryInterface ){
  await queryInterface.createTable('Connections', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    MyUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ConnUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    DocumentId: {
      type: DataTypes.INTEGER,
      //Profile Picture
    },
    GendersM_Id: {
      type: DataTypes.INTEGER,
      //If there is no ConnUserId, then this is the gender of the Connection
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAlive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    isMyself: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    dob: {
      type: DataTypes.DATE,
    },
    dod: {
      type: DataTypes.DATE,
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
  await queryInterface.dropTable('Connections');
};
