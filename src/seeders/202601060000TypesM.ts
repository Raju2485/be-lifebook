import type { QueryInterface } from 'sequelize';

const TYPE_MASTER_VALUES = [
  'Self',
  'Government Establishment',
  'Company',
  'Official',
  'Guardian',
  'Charity',
  'Business',
  'Others',
];

export async function up(queryInterface: QueryInterface) {
  const now = new Date();

  await queryInterface.bulkInsert(
    'TypesM',
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
    'TypesM',
    {
      name: TYPE_MASTER_VALUES,
    },
    {}
  );
}

