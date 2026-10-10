import { DataTypes } from 'sequelize';
import type { QueryInterface } from 'sequelize';

export async function up( queryInterface: QueryInterface ){
  await queryInterface.createTable('Dropdowns', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['months', 'years']],
        msg: 'Type must be months / years',
      },
    },
    sequence: {
      type: DataTypes.INTEGER,
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

  await queryInterface.addConstraint('Dropdowns', {
    fields: ['name', 'type'],
    type: 'unique',
    name: 'Dropdowns_name_type_uk',
  });
};

export async function down(queryInterface: QueryInterface ){
  await queryInterface.dropTable('Dropdowns');
};
