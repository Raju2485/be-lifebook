import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';
import { sequelize } from '../config/database';
import type { Users } from './users';
import type { Organizations } from './organizations';
import type { AccCategsM } from './accCategsM';
export class Accounts extends Model<
  InferAttributes<Accounts>,
  InferCreationAttributes<Accounts>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare OrgId: number;
  declare AccCategsM_Id: number;
  declare UserId: CreationOptional<number>;
  declare isClosed: CreationOptional<boolean>;
  declare natureOfAccount: CreationOptional<'cash' | 'bank' | null>;
  declare isActive: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare User?: NonAttribute<Users>;
  declare AccCategsM?: NonAttribute<AccCategsM>;
  declare Organization?: NonAttribute<Organizations>;
}

Accounts.init(
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
    },
    OrgId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    AccCategsM_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    UserId: {
      type: DataTypes.INTEGER,
    },
    isClosed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    natureOfAccount: {
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [['Cash', 'Bank', null]],
          msg: 'natureOfAccount must be one of the following: Cash / Bank/ null',
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
    indexes: [
      {
        unique: true,
        fields: ['OrgId', 'name'],
        name: 'Accounts_OrgId_name_uk',
      },
    ],
  }
);
