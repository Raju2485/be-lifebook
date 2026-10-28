import type { QueryInterface} from 'sequelize';
import { Op } from 'sequelize';

const KEYS_AND_LABELS_VALUES = [
  {
    apiEndpoint: '/api/v1/get-accounting-reports',
    json: {
      journals: 'Journals',
      ledgers: 'Ledgers',
      trialBalanceUnudjusted: 'Trial Balance (Unadjusted)',
      trialBalanceAdjusted: 'Trial Balance (Adjusted)',
      tradingAccount: 'Trading Account',
      pAndLAccount: 'P&L Account',
    },
  },
];

export async function up(queryInterface: QueryInterface) {
  const now = new Date();

  await queryInterface.bulkInsert(
    'KeysAndLabels',
    KEYS_AND_LABELS_VALUES.map((obj) => ({
      apiEndpoint: obj.apiEndpoint,
      json: JSON.stringify(obj.json),
      createdAt: now,
      updatedAt: now,
    })),
    {}
  );
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete(
    'KeysAndLabels',
    {
      apiEndpoint: { [Op.in]: KEYS_AND_LABELS_VALUES.map((obj) => obj.apiEndpoint) as string[] },
    },
    {}
  );
}
