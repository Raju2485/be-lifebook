import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../config/database';

export class RolesM_TypesM_J extends Model<
  InferAttributes<RolesM_TypesM_J>,
  InferCreationAttributes<RolesM_TypesM_J>
> {
  declare id: CreationOptional<number>;
  declare RolesM_Id: number;
  declare TypesM_Id: number;
  declare isActive: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

RolesM_TypesM_J.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    RolesM_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    TypesM_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    tableName: 'RolesM_TypesM_J',
    timestamps: true,
  }
);

