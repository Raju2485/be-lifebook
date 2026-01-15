import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from 'sequelize';
import { sequelize } from '../config/database'; // adjust import to your sequelize instance
export class Users extends Model<
  InferAttributes<Users>,
  InferCreationAttributes<Users>
> {
  declare id: CreationOptional<number>;
  declare email: string | null;
  declare password: string | null;
  declare name: string;
  declare middleName: string | null;
  declare surName: string | null;
  declare mobileNumber: number | null;
  declare countryCode: string | null;
  declare isActive: CreationOptional<boolean>;
  declare dob: Date;
  declare tob: string | null;
  declare isVerified: CreationOptional<boolean>;
  declare TypeId: number | null;
  declare GenderId: number | null;
  declare uid: number;
  declare hash: CreationOptional<string>;
  declare orgId: CreationOptional<integer>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
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
      allowNull: true,
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
    TypeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    GenderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    uid: {
      type: DataTypes.INTEGER,
      unique: true,
    },
    hash: {
      type: DataTypes.STRING,
    },
    orgId: {
      type: DataTypes.INTEGER,
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
