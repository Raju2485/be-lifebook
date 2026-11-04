import type { QueryInterface, Op } from 'sequelize';

const YEARS_VALUES = [
  {
    name: '2020',
    sequence: 1,
  },
  {
    name: '2021',
    sequence: 2,
  },
  {
    name: '2022',
    sequence: 3,
  },
  {
    name: '2023',
    sequence: 4,
  },
  {
    name: '2024',
    sequence: 5,
  },
  {
    name: '2025',
    sequence: 6,
  },
  {
    name: '2026',
    sequence: 7,
  },
  {
    name: '2027',
    sequence: 8,
  },
  {
    name: '2028',
    sequence: 9,
  },
  {
    name: '2029',
    sequence: 10,
  },
  {
    name: '2030',
    sequence: 11,
  },
];

export async function up(queryInterface: QueryInterface) {
  const now = new Date();

  await queryInterface.bulkInsert(
    'Years',
    YEARS_VALUES.map((obj) => ({
      name: obj.name,
      sequence: obj.sequence,
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
