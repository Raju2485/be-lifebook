import type { QueryInterface } from 'sequelize';

const CARDS_VALUES = [
  {
    name: 'Business & Accounts',
    sequence: 1,
    redirectUrl: 'businessAndAccounts',
    type: 'dashboard',
  },
  {
    name: 'Dairy',
    sequence: 2,
    redirectUrl: 'dairy',
    type: 'dashboard',
  },
  {
    name: 'Relatives',
    sequence: 3,
    redirectUrl: 'relatives',
    type: 'dashboard',
  },
  {
    name: 'Tasks',
    sequence: 4,
    redirectUrl: 'tasks',
    type: 'dashboard',
  },
];

export async function up(queryInterface: QueryInterface) {
  const now = new Date();

  await queryInterface.bulkInsert(
    'Cards',
    CARDS_VALUES.map((obj) => ({
      name: obj.name,
      sequence: obj.sequence,
      redirectUrl: obj.redirectUrl,
      type: obj.type,
      createdAt: now,
      updatedAt: now,
    })),
    {}
  );
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete(
    'Cards',
    {
      name: CARDS_VALUES.map(obj => obj.name),
    },
    {}
  );
}
