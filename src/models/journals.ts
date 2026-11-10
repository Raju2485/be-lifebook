import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';
import { sequelize } from '../config/database';
import type { Accounts } from './accounts';

export class Journals extends Model<
  InferAttributes<Journals>,
  InferCreationAttributes<Journals>
> {
  declare id: CreationOptional<number>;
  declare particulars: string;
  declare amount: number;
  declare date: Date;
  declare DebtorId: number;
  declare CreditorId: number;
  declare BkId: number;
  declare OrgId: number;
  declare MonthId: number;
  declare YearId: number;
  declare isActive: CreationOptional<boolean>;
  declare isAdjustment: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare Debtor?: NonAttribute<Accounts>;
  declare Creditor?: NonAttribute<Accounts>;
  declare BookKeeper?: NonAttribute<Accounts>;
}

Journals.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    particulars: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    DebtorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    CreditorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    BkId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    OrgId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    MonthId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    YearId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    isAdjustment: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: 'Journals',
    timestamps: true,
  }
);

