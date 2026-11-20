import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../config/database';


export class FriendsAndFams extends Model<
  InferAttributes<FriendsAndFams>,
  InferCreationAttributes<FriendsAndFams>
> {
  declare id: CreationOptional<number>;
  declare ConnectionId: number;
  declare RelationsM_Id: number;
  declare RelativeId: number;
  declare relationOthersValue: CreationOptional<string>;
  declare isActive: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

FriendsAndFams.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    ConnectionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    RelationsM_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    RelativeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    relationOthersValue: {
      type: DataTypes.STRING,
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
    tableName: 'FriendsAndFams',
    timestamps: true,
  }
);

