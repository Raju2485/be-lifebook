// import 'reflect-metadata';
// import { Table, Column, DataType, Model, PrimaryKey, Default, AllowNull, Unique, AutoIncrement } from 'sequelize-typescript';
// @Table({ tableName: 'Users', timestamps: true })
// export class Users extends Model<Users> {
//   @Unique
//   @AllowNull(false)
//   @PrimaryKey
//   @AutoIncrement
//   @Column(DataType.INTEGER)
//   id!: number;

//   @Unique
//   @AllowNull(false)
//   @Column(DataType.STRING)
//   email!: string;

//   @AllowNull(false)
//   @Column(DataType.STRING)
//   password!: string;

//   @AllowNull(false)
//   @Column(DataType.STRING)
//   name!: string;
  
//   @Column(DataType.STRING)
//   middleName!: string;
  
//   @Column(DataType.STRING)
//   surName!: string;

//   @AllowNull(false)
//   @Column(DataType.INTEGER)
//   mobileNumber!: number;

//   @AllowNull(false)
//   @Column(DataType.STRING)
//   countryCode!: string;

//   @AllowNull(false)
//   @Default(true)
//   @Column(DataType.BOOLEAN)
//   isActive!: boolean;

//   @AllowNull(false)
//   @Column(DataType.DATEONLY)
//   dob!: Date;

//   @Column(DataType.TIME)
//   tob!: string;
  
//   @AllowNull(false)
//   @Default(false)
//   @Column(DataType.BOOLEAN)
//   isVerified!: boolean;
  
//   @Column(DataType.INTEGER)
//   AccntTypeId!: number;
  
//   @Column(DataType.INTEGER)
//   GenderId!: number;
  
//   @Unique
//   @AllowNull(false)
//   @Column(DataType.INTEGER)
//   uid!: number;
// }
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
  declare AccntTypeId: number | null;
  declare GenderId: number | null;
  declare uid: number;
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
    AccntTypeId: {
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
  },
  {
    sequelize,
    tableName: 'Users',
    timestamps: true,
  }
);