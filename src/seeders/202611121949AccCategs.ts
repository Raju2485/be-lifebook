import type { QueryInterface } from 'sequelize';
import { Op } from 'sequelize';

const CATEGORIES_VALUES = [
  {
    name: 'Capital',
    debitCreditRule: 'Debit the decrease and credit the increase',
  },
  {
    name: 'Revenue/Gain',
    debitCreditRule: 'Debit the decrease and credit the increase',
  },
  {
    name: 'Asset',
    debitCreditRule: 'Debit the increase and credit the decrease',
  },
  {
    name: 'Expense/Loss',
    debitCreditRule: 'Debit the increase and credit the decrease',
  },
  {
    name: 'Liability',
    debitCreditRule: 'Debit the decrease and credit the increase',
  },
];

export async function up(queryInterface: QueryInterface) {
  const now = new Date();

  await queryInterface.bulkInsert(
    'AccCategs',
    CATEGORIES_VALUES.map((obj) => ({
      name: obj.name,
      debitCreditRule: obj.debitCreditRule,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    })),
    {}
  );
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete(
    'AccCategs',
    {
      name: { [Op.in]: CATEGORIES_VALUES.map((obj) => obj.name) as string[] },
    },
    {}
  );
}
