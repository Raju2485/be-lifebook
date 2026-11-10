import { Request, Response } from 'express';
import { sequelize } from '../config/database';
import type { ModelAttributeColumnReferencesOptions } from 'sequelize';

type SchemaColumn = {
  name: string;
  type: string | undefined;
  allowNull: boolean;
  unique: boolean;
  primaryKey: boolean;
  autoIncrement: boolean;
  defaultValue: unknown;
  foreignKey: boolean;
  references: { table: string | undefined; key: string | undefined } | null;
  validations: { rule: string; value: unknown }[];
};

type SchemaAssociation = {
  type: string;
  target: string;
  foreignKey: string;
  as: string | undefined;
  through: string | undefined;
};

type SchemaNode = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    tableName: string;
    table: string;
    columns: SchemaColumn[];
    associations: SchemaAssociation[];
  };
};

type SchemaEdge = {
  id: string;
  source: string;
  target: string;
  animated: boolean;
  label: string;
  data: { foreignKey: string };
};

function resolveReferences(
  references: ModelAttributeColumnReferencesOptions | string | undefined
): SchemaColumn['references'] {
  if (!references || typeof references === 'string') {
    return null;
  }
  const modelRef = references.model;
  let table: string | undefined;
  if (typeof modelRef === 'string') {
    table = modelRef;
  } else if (
    modelRef &&
    'tableName' in modelRef &&
    typeof modelRef.tableName === 'string'
  ) {
    table = modelRef.tableName;
  }
  return { table, key: references.key };
}

export const getSchema = (req: Request, res: Response) => {
  const nodes: SchemaNode[] = [];
  const edges: SchemaEdge[] = [];

  for (const model of Object.values(sequelize.models)) {
    const attributes = model.getAttributes();

    const columns = Object.entries(attributes).map(([name, attr]) => {
      const validate = attr.validate;
      return {
        name,
        type: attr.type ? String(attr.type) : undefined,
        allowNull: attr.allowNull ?? true,
        unique: !!attr.unique,
        primaryKey: !!attr.primaryKey,
        autoIncrement: !!attr.autoIncrement,
        defaultValue:
          attr.defaultValue != null && typeof attr.defaultValue === 'object' &&
          'toString' in attr.defaultValue &&
          typeof (attr.defaultValue as { toString: () => string }).toString ===
            'function'
            ? (attr.defaultValue as { toString: () => string }).toString()
            : attr.defaultValue,
        foreignKey: !!attr.references,
        references: resolveReferences(attr.references),
        validations: validate
          ? Object.keys(validate).map((key) => ({
              rule: key,
              value: validate[key as keyof typeof validate],
            }))
          : [],
      };
    });

    const associations = Object.values(model.associations).map((assoc) => {
      let through: string | undefined;
      if (assoc.associationType === 'BelongsToMany') {
        const btm = assoc as {
          throughModel?: { name?: string };
          through?: { model?: { name?: string } };
        };
        through =
          btm.throughModel?.name ?? btm.through?.model?.name ?? undefined;
      }
      return {
        type: assoc.associationType,
        target: assoc.target.name,
        foreignKey: assoc.foreignKey,
        as: assoc.as,
        through,
      };
    });

    nodes.push({
      id: model.name,
      type: 'tableNode',
      position: { x: 0, y: 0 },
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
