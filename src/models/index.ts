import { TypeMasters } from './type-masters';
import { GenderMasters } from './gender-masters';
import { Users } from './users';
import { RelationMasters } from './relation-masters';
import { UsrConns } from './usr-conns';
import { AccTypeMasters } from './acc-type-masters';
import { Organizations } from './organizations';
import { Accounts } from './accounts';
import { RoleMasters } from './role-masters';
import { AccRoles } from './acc-roles';
import { CashBooks } from './cash-books';

TypeMasters.hasMany(Users);
Users.belongsTo(TypeMasters, {foreignKey: 'TypeId'});

GenderMasters.hasMany(Users);
Users.belongsTo(GenderMasters, {foreignKey: 'GenderId'});

Users.belongsToMany(Users, {as: 'Connections', through: UsrConns, foreignKey: 'UserId'});
Users.belongsToMany(Users, {as: 'Users',through: UsrConns, foreignKey: 'ConnId'});

RelationMasters.hasMany(UsrConns, {foreignKey:'RelId'});
UsrConns.belongsTo(RelationMasters);

Users.hasMany(Accounts);
Accounts.belongsTo(Users);

Organizations.hasMany(Accounts, {foreignKey: 'OrgId'});
Accounts.belongsTo(Organizations);

AccTypeMasters.hasMany(Accounts, {foreignKey: 'AccTypeId'});
Accounts.belongsTo(AccTypeMasters);

Accounts.belongsToMany(RoleMasters, {as: 'Roles', through: AccRoles, foreignKey: 'AccountId'});
RoleMasters.belongsToMany(Accounts, {as: 'Accounts',through: AccRoles, foreignKey: 'RoleId'});

Accounts.hasMany(CashBooks, {as: 'Debitor', foreignKey: 'DebitorId'});
CashBooks.belongsTo(Accounts, { as: 'Debitor' });

Accounts.hasMany(CashBooks, {as: 'Creditor', foreignKey: 'CreditorId'});
CashBooks.belongsTo(Accounts, { as: 'Creditor' });

Accounts.hasMany(CashBooks, {as: 'BookKeeper', foreignKey: 'BkId'});
CashBooks.belongsTo(Accounts, { as: 'BookKeeper' });

Organizations.hasMany(CashBooks, {foreignKey: 'OrgId'});
CashBooks.belongsTo(Organizations);

export default {
  TypeMasters,
  GenderMasters,
  Users,
  RelationMasters,
  UsrConns,
  AccTypeMasters,
  Organizations,
  Accounts,
  RoleMasters,
  AccRoles,
  CashBooks,
};
