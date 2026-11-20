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
  declare OrgId: number;
  declare YearsM_Id: number;
  declare MonthsM_Id: number;
  declare isLatest: boolean;
  declare jsonData: Record<string, any>;
  declare sequence: number;
  declare isActive: boolean;
  declare newChanges: boolean;
  declare DocumentId: CreationOptional<number>;
  declare AccountId: CreationOptional<number>;
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
    OrgId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    YearsM_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    MonthsM_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    AccountId: {
      type: DataTypes.INTEGER,
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

