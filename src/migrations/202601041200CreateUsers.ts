import { DataTypes } from 'sequelize';
import type { QueryInterface } from 'sequelize';

export async function up( queryInterface: QueryInterface ){
  await queryInterface.createTable('Users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    middleName: {
      type: DataTypes.STRING,
    },
    surName: {
      type: DataTypes.STRING,
    },
    mobileNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    tob: {
      type: DataTypes.TIME,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    TypeId: {
      type: DataTypes.INTEGER,
    },
    GenderId: {
      type: DataTypes.INTEGER,
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    hash: {
      type: DataTypes.STRING,
    },
    orgId: {
      type: DataTypes.INTEGER,
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
  await queryInterface.sequelize.query(
    `CREATE SEQUENCE users_uid_seq START 1000;
  ALTER TABLE "Users"
  ALTER COLUMN "uid"
  SET DEFAULT nextval('users_uid_seq');`
  );
};

export async function down(queryInterface: QueryInterface ){
  await queryInterface.dropTable('Users');
};
