import { Request, Response } from 'express';
import { sequelize } from '../config/database';

export const getSchema = (req: Request, res: Response) => {

    const nodes = [];
    const edges = [];

    for (const model of Object.values(sequelize.models)) {
      const attributes = model.getAttributes();

      const columns = Object.entries(attributes).map(([name, attr]) => ({
        name,

        type: attr.type?.toString(),

        allowNull: attr.allowNull ?? true,

        unique: !!attr.unique,

        primaryKey: !!attr.primaryKey,

        autoIncrement: !!attr.autoIncrement,

        defaultValue: attr.defaultValue?.toString?.() ?? attr.defaultValue,

        foreignKey: !!attr.references,

        references: attr.references
          ? {
              table:
                typeof attr.references.model === 'string'
                  ? attr.references.model
                  : attr.references.model?.tableName,
              key: attr.references.key,
            }
          : null,

        validations: attr.validate
          ? Object.keys(attr.validate).map((key) => ({
              rule: key,
              value: attr.validate[key],
            }))
          : [],
      }));

      const associations = Object.values(model.associations).map((assoc) => ({
        type: assoc.associationType,
        target: assoc.target.name,
        foreignKey: assoc.foreignKey,
        as: assoc.as,
        through: assoc.throughModel?.name || assoc.through?.model?.name,
      }));

      nodes.push({
        id: model.name,

        type: 'tableNode',

        position: {
          x: 0,
          y: 0,
        },

        data: {
          tableName: model.name,
          table: model.tableName,
          columns,
          associations,
        },
      });

      Object.values(model.associations).forEach((assoc) => {
        edges.push({
          id: `${model.name}-${assoc.target.name}-${assoc.associationType}`,

          source: model.name,

          target: assoc.target.name,

          animated: false,

          label: assoc.associationType,

          data: {
            foreignKey: assoc.foreignKey,
          },
        });
      });
    }

  return res.status(200).json({
      success: true,
      data: { nodes, edges },
      msg: 'Schema fetched successfully',
      metaData: req?.meta ?? null,
    });
};
