import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../config/database';

export class CarriedForwards extends Model<
  InferAttributes<CarriedForwards>,
  InferCreationAttributes<CarriedForwards>
> {
  declare id: CreationOptional<number>;
  declare AccountId: number;
  declare amount: number;
  declare month: CreationOptional<string>;
  declare monthNumber: CreationOptional<number>;
  declare year: number;
  declare isActive: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

CarriedForwards.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    AccountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    month: {
      type: DataTypes.STRING,
    },
    monthNumber: {
      type: DataTypes.INTEGER,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
  },
  {
    sequelize,
    tableName: 'CarriedForwards',
    timestamps: true,
  }
);

