import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  NonAttribute,
} from 'sequelize';
import { sequelize } from '../config/database';
import type { Accounts } from './accounts';

export class AccCategs extends Model<
  InferAttributes<AccCategs>,
  InferCreationAttributes<AccCategs>
> {
  declare id: CreationOptional<number>;
  declare name:
    | 'Capital'
    | 'Revenue/Gain'
    | 'Asset'
    | 'Expense/Loss'
    | 'Liability';
  declare debitCreditRule:
    | 'Debit the increase and credit the decrease'
    | 'Debit the decrease and credit the increase';
  declare isActive: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare Accounts?: NonAttribute<Accounts[]>;
}

// Initialize model
AccCategs.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isIn: [
          ['Capital', 'Revenue/Gain', 'Asset', 'Expense/Loss', 'Liability'],
        ],
        msg: 'Name must be Capital / Revenue/Gain / Asset / Expense/Loss / Liability',
      },
    },
    debitCreditRule: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [
          [
            'Debit the increase and credit the decrease',
            'Debit the decrease and credit the increase',
          ],
        ],
        msg: 'DebitCreditRule must be Debit the increase and credit the decrease / Debit the decrease and credit the increase',
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
    tableName: 'AccCategs',
    timestamps: true,
  }
);

