import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../config/database';

export class MonthsM extends Model<
  InferAttributes<MonthsM>,
  InferCreationAttributes<MonthsM>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare type: string;
  declare sequence: number;
  declare fromDate: CreationOptional<Date>;
  declare toDate: CreationOptional<Date>;
  declare fromMonthNum: CreationOptional<number>;
  declare toMonthNum: CreationOptional<number>;
  declare isActive: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

MonthsM.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['months', 'quarters']],
        msg: 'Type must be months / quarters',
      },
    },
    sequence: {
      type: DataTypes.INTEGER,
      unique: true,
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
  },
  {
    sequelize,
    tableName: 'MonthsM',
    timestamps: true,
  }
);

