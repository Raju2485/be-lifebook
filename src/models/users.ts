import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  NonAttribute,
} from 'sequelize';
import { sequelize } from '../config/database'; // adjust import to your sequelize instance
import type { Accounts } from './accounts';

export class Users extends Model<
  InferAttributes<Users>,
  InferCreationAttributes<Users>
> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare handle: string;
  declare password: string;
  declare name: string;
  declare middleName: CreationOptional<string>;
  declare surName: CreationOptional<string>;
  declare mobileNumber: CreationOptional<number>;
  declare countryCode: CreationOptional<string>;
  declare isActive: CreationOptional<boolean>;
  declare dob: CreationOptional<Date>;
  declare tob: CreationOptional<string>;
  declare isVerified: CreationOptional<boolean>;
  declare TypesM_Id: number;
  declare typeOthersValue: CreationOptional<string>;
  declare GendersM_Id: number;
  declare genderOthersValue: CreationOptional<string>;
  declare hash: CreationOptional<string>;
  declare hashExpiresAt: CreationOptional<Date>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare Accounts?: NonAttribute<Accounts[]>;
}

// Initialize model
Users.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    handle: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    middleName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    surName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobileNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    tob: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    TypesM_Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    typeOthersValue: {
      type: DataTypes.STRING,
    },
    GendersM_Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    genderOthersValue: {
      type: DataTypes.STRING,
    },
    hash: {
      type: DataTypes.STRING,
    },
    hashExpiresAt: {
      type: DataTypes.DATE,
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
    tableName: 'Users',
    timestamps: true,
  }
);
