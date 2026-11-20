import type { QueryInterface } from 'sequelize';

const RELATION_MASTER_VALUES = [
  'Mother',
  'Legal Father',
  'Legal Mother',
  'Guardian',
  'Wife',
  'Husband',
  'Friend',
  'Teacher',
  'Boyfriend',
  'Girlfriend',
  'Others',
  'Other Husband',
  'Other Wife',
];

export async function up(queryInterface: QueryInterface) {
  const now = new Date();

  await queryInterface.bulkInsert(
    'RelationsM',
    RELATION_MASTER_VALUES.map((name) => ({
      name,
      createdAt: now,
      updatedAt: now,
    })),
    {}
  );
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete(
    'RelationsM',
    {
      name: RELATION_MASTER_VALUES,
    },
    {}
  );
}
