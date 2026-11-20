import type { QueryInterface } from 'sequelize';

const GENDER_MASTER_VALUES = [
  'Male',
  'Female',
  'Others',
];

export async function up(queryInterface: QueryInterface) {
  const now = new Date();

  await queryInterface.bulkInsert(
    'GendersM',
    GENDER_MASTER_VALUES.map((name) => ({
      name,
      createdAt: now,
      updatedAt: now,
    })),
    {}
  );
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete(
    'GendersM',
    {
      name: GENDER_MASTER_VALUES,
    },
    {}
  );
}
