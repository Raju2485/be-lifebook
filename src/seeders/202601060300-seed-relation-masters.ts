import type { QueryInterface } from 'sequelize';

const RELATION_MASTER_VALUES = [
  'father',
  'mother',
  'legalFather',
  'legalMother',
  'guardian',
  'wife',
  'son',
  'daughter',
  'friend',
  'teacher',
  'boyfriend',
  'girlfriend',
  'other',
];

export async function up(queryInterface: QueryInterface) {
  const now = new Date();

  await queryInterface.bulkInsert(
    'RelationMasters',
    RELATION_MASTER_VALUES.map((name) => ({
      name,
      createdAt: now,
      updatedAt: now,
    })),
    {}
  );
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete(
    'RelationMasters',
    {
      name: RELATION_MASTER_VALUES,
    },
    {}
  );
}
