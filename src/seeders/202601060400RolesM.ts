import type { QueryInterface } from 'sequelize';

const ROLE_MASTER_VALUES = [
  'Book Keeper',
  'Accountant',
  'Auditor',
  'Manager',
  'Clerk',
];

export async function up(queryInterface: QueryInterface) {
  const now = new Date();

  await queryInterface.bulkInsert(
    'RolesM',
    ROLE_MASTER_VALUES.map((name) => ({
      name,
      createdAt: now,
      updatedAt: now,
    })),
    {}
  );
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete(
    'RolesM',
    {
      name: ROLE_MASTER_VALUES,
    },
    {}
  );
}
