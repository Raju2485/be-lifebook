import type { QueryInterface } from 'sequelize';

const TYPE_MASTER_VALUES = [
  'self',
  'government establishment',
  'company',
  'official',
  'guardian',
  'charity',
  'business',
  'other',
];

export async function up(queryInterface: QueryInterface) {
  const now = new Date();

  await queryInterface.bulkInsert(
    'TypeMasters',
    TYPE_MASTER_VALUES.map((name) => ({
      name,
      createdAt: now,
      updatedAt: now,
    })),
    {}
  );
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete(
    'TypeMasters',
    {
      name: TYPE_MASTER_VALUES,
    },
    {}
  );
}

