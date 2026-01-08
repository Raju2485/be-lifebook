import { TypeMasters } from './type-masters';
import { GenderMasters } from './gender-masters';
import { Users } from './users';
import { AccessAndRefreshTokens } from './access-and-refresh-tokens';
import { RelationMasters } from './relation-masters';
import { UsrConns } from './usr-conns';
import { AccTypeMasters } from './acc-type-masters';
import { Organizations } from './organizations';
import { Accounts } from './accounts';
import { RoleMasters } from './role-masters';
import { AccRoles } from './acc-roles';
import { CashBooks } from './cash-books';

TypeMasters.hasMany(Users, {foreignKey: 'TypeId'});
Users.belongsTo(TypeMasters, {foreignKey: 'TypeId'});

GenderMasters.hasMany(Users, {foreignKey: 'GenderId'});
Users.belongsTo(GenderMasters, {foreignKey: 'GenderId'});

Users.hasMany(AccessAndRefreshTokens, {foreignKey:'UserId'});
AccessAndRefreshTokens.belongsTo(Users, { foreignKey: 'UserId' });

Users.belongsToMany(Users, {as: 'Connections', through: UsrConns, foreignKey: 'UserId', otherKey: 'ConnId'});
Users.belongsToMany(Users, {as: 'Users',through: UsrConns, foreignKey: 'ConnId', otherKey: 'UserId'});

RelationMasters.hasMany(UsrConns, {foreignKey:'RelId'});
UsrConns.belongsTo(RelationMasters, { foreignKey: 'RelId' });

Users.hasMany(Accounts, { foreignKey: 'UserId' });
Accounts.belongsTo(Users, { foreignKey: 'UserId' });

Organizations.hasMany(Accounts, { foreignKey: 'OrgId' });
Accounts.belongsTo(Organizations, { foreignKey: 'OrgId' });

AccTypeMasters.hasMany(Accounts, { foreignKey: 'AccTypeId' });
Accounts.belongsTo(AccTypeMasters, { foreignKey: 'AccTypeId' });

Accounts.belongsToMany(RoleMasters, {
  as: 'Roles',
  through: AccRoles,
  foreignKey: 'AccountId',
  otherKey: 'RoleId',
});
RoleMasters.belongsToMany(Accounts, {
  as: 'Accounts',
  through: AccRoles,
  foreignKey: 'RoleId',
  otherKey: 'AccountId',
});

Accounts.hasMany(CashBooks, { as: 'Debitor', foreignKey: 'DebitorId' });
CashBooks.belongsTo(Accounts, { as: 'Debitor', foreignKey: 'DebitorId' });

Accounts.hasMany(CashBooks, { as: 'Creditor', foreignKey: 'CreditorId' });
CashBooks.belongsTo(Accounts, { as: 'Creditor', foreignKey: 'CreditorId' });

Accounts.hasMany(CashBooks, { as: 'BookKeeper', foreignKey: 'BkId' });
CashBooks.belongsTo(Accounts, { as: 'BookKeeper', foreignKey: 'BkId' });

Organizations.hasMany(CashBooks, { foreignKey: 'OrgId' });
CashBooks.belongsTo(Organizations, { foreignKey: 'OrgId' });

export default {
  TypeMasters,
  GenderMasters,
  Users,
  AccessAndRefreshTokens,
  RelationMasters,
  UsrConns,
  AccTypeMasters,
  Organizations,
  Accounts,
  RoleMasters,
  AccRoles,
  CashBooks,
};
