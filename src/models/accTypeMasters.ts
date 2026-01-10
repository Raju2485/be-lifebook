import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from 'sequelize';
import { sequelize } from '../config/database';

export class AccTypeMasters extends Model<
  InferAttributes<AccTypeMasters>,
  InferCreationAttributes<AccTypeMasters>
> {
  declare id: CreationOptional<number>;
  declare name: 'personal' | 'real' | 'nominal';
  declare goldenRule: 'Debit the receiver, Credit the giver' | 'Debit what comes in, Credit what goes out' | 'Debit expenses and losses, Credit incomes and gains';
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// Initialize model
AccTypeMasters.init(
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
        isIn: {
          args: [['personal', 'real', 'nominal']],
          msg: 'Name must be one of the following: personal / real / nominal'
        }
      }
    },
    goldenRule: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isIn: {
          args: [['Debit the receiver, Credit the giver', 'Debit what comes in, Credit what goes out', 'Debit expenses and losses, Credit incomes and gains']],
          msg: 'Golden rule must be one of the following: Debit the receiver, Credit the giver / Debit what comes in, Credit what goes out / Debit expenses and losses, Credit incomes and gains'
        }
      }
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
    tableName: 'AccTypeMasters',
    timestamps: true,
  }
);

