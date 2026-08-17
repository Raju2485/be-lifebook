import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../config/database';

export class Accounts extends Model<
  InferAttributes<Accounts>,
  InferCreationAttributes<Accounts>
> {
  declare id: CreationOptional<number>;
  declare UserId: number;
  declare OrgId: number;
  declare AccTypeId: number;
  declare isAdmin: CreationOptional<boolean>;
  declare isMember: CreationOptional<boolean>;
  declare natureOfAccount: CreationOptional<'cash' | 'bank' | null>;
  declare isActive: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Accounts.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    OrgId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    AccTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isMember: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    natureOfAccount: {
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [['cash', 'bank', null]],
          msg: 'natureOfAccount must be one of the following: cash / bank/ null',
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
  },
  {
    sequelize,
    tableName: 'Accounts',
    timestamps: true,
  }
);

