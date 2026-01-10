import type { QueryInterface } from 'sequelize';

const GENDER_MASTER_VALUES = [
  'male',
  'female',
  'other',
];

export async function up(queryInterface: QueryInterface) {
  const now = new Date();

  await queryInterface.bulkInsert(
    'GenderMasters',
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
    'GenderMasters',
    {
      name: GENDER_MASTER_VALUES,
    },
    {}
  );
}
