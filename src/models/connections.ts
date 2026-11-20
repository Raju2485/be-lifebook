import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../config/database';


export class Connections extends Model<
  InferAttributes<Connections>,
  InferCreationAttributes<Connections>
> {
  declare id: CreationOptional<number>;
  declare MyUserId: number;
  declare ConnUserId: number;
  declare DocumentId: number;
  declare GendersM_Id: number;
  declare name: string;
  declare dob: CreationOptional<Date>;
  declare dod: CreationOptional<Date>;
  declare isAlive: CreationOptional<boolean>;
  declare isMyself: CreationOptional<boolean>;
  declare isActive: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Connections.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    MyUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ConnUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    DocumentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    GendersM_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dod: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isAlive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    isMyself: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: 'Connections',
    timestamps: true,
  }
);

