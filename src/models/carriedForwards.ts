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
  declare debitAmount: CreationOptional<number>;
  declare creditAmount: CreationOptional<number>;
  declare OrgId: number;
  declare MonthId: number;
  declare YearId: number;
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
    debitAmount: {
      type: DataTypes.DECIMAL(12, 2),
    },
    creditAmount: {
      type: DataTypes.DECIMAL(12, 2),
    },
    OrgId: {
      type: DataTypes.INTEGER,
    },
    MonthId: {
      type: DataTypes.INTEGER,
    },
    YearId: {
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
  },
  {
    sequelize,
    tableName: 'CarriedForwards',
    timestamps: true,
  }
);

