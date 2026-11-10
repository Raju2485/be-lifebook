import type { QueryInterface } from 'sequelize';
import { Op } from 'sequelize';

const YEARS_VALUES = [
  {
    name: '2020'
  },
  {
    name: '2021'
  },
  {
    name: '2022'
  },
  {
    name: '2023'
  },
  {
    name: '2024'
  },
  {
    name: '2025'
  },
  {
    name: '2026'
  },
  {
    name: '2027'
  },
  {
    name: '2028'
  },
  {
    name: '2029'
  },
  {
    name: '2030'
  },
];

export async function up(queryInterface: QueryInterface) {
  const now = new Date();

  await queryInterface.bulkInsert(
    'Years',
    YEARS_VALUES.map((obj) => ({
      name: obj.name,
      createdAt: now,
      updatedAt: now,
    })),
    {}
  );
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete(
    'Years',
    {
      name: { [Op.in]: YEARS_VALUES.map((obj) => obj.name) as string[] },
    },
    {}
  );
}
