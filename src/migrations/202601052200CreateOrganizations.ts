import { DataTypes } from 'sequelize';
import type { QueryInterface } from 'sequelize';

export async function up( queryInterface: QueryInterface ){
  await queryInterface.createTable('Organizations', {
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
    },
    uid: {
      type: DataTypes.INTEGER,
      unique: true
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
    `CREATE SEQUENCE organizations_uid_seq START 1000;
  ALTER TABLE "Organizations"
  ALTER COLUMN "uid"
  SET DEFAULT nextval('organizations_uid_seq');`
  );
};

export async function down(queryInterface: QueryInterface ){
  await queryInterface.dropTable('Organizations');
};
