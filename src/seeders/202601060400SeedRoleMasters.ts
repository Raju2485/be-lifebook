import type { QueryInterface } from 'sequelize';

const ROLE_MASTER_VALUES = [
  'bookKeeper',
  'accountant',
  'auditor',
  'manager',
  'clerk',
];

export async function up(queryInterface: QueryInterface) {
  const now = new Date();

  await queryInterface.bulkInsert(
    'RoleMasters',
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
    'RoleMasters',
    {
      name: ROLE_MASTER_VALUES,
    },
    {}
  );
}
