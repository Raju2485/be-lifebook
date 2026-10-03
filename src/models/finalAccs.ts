import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../config/database';

export class FinalAccs extends Model<
  InferAttributes<FinalAccs>,
  InferCreationAttributes<FinalAccs>
> {
  declare id: CreationOptional<number>;
  declare orgId: number;
  declare year: number;
  declare month: string;
  declare monthNumber: number;
  declare isLatest: boolean;
  declare jsonData: Record<string, any>;
  declare sequence: number;
  declare isActive: boolean;
  declare newChanges: boolean;
  declare DocumentId: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

FinalAccs.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    orgId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    month: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    monthNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isLatest: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    jsonData: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    sequence: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    newChanges: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    DocumentId: {
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
    tableName: 'FinalAccs',
    timestamps: true,
  }
);

