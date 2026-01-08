import type { QueryInterface } from 'sequelize';

const ACC_TYPE_MASTER_VALUES = [
  {
    name: 'personal',
    goldenRule: 'Debit the receiver, Credit the giver',
  },
  {
    name: 'real',
    goldenRule: 'Debit what comes in, Credit what goes out',
  },
  {
    name: 'nominal',
    goldenRule: 'Debit expenses and losses, Credit incomes and gains',
  },
];

export async function up(queryInterface: QueryInterface) {
  const now = new Date();

  await queryInterface.bulkInsert(
    'AccTypeMasters',
    ACC_TYPE_MASTER_VALUES.map((item) => ({
      name: item.name,
      goldenRule: item.goldenRule,
      createdAt: now,
      updatedAt: now,
    })),
    {}
  );
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete(
    'AccTypeMasters',
    {
      name: ACC_TYPE_MASTER_VALUES.map((item) => item.name),
    },
    {}
  );
}
