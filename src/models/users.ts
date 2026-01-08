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
  declare email: string;
  declare password: string;
  declare name: string;
  declare middleName: string | null;
  declare surName: string | null;
  declare mobileNumber: number;
  declare countryCode: string;
  declare isActive: CreationOptional<boolean>;
  declare dob: Date;
  declare tob: string | null;
  declare isVerified: CreationOptional<boolean>;
  declare TypeId: number | null;
  declare GenderId: number | null;
  declare uid: number;
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
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
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
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false,
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
      allowNull: false,
      unique: true,
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
