import { TypeMasters } from './typeMasters';
import { GenderMasters } from './genderMasters';
import { Users } from './users';
import { AccessAndRefreshTokens } from './accessAndRefreshTokens';
import { RelationMasters } from './relationMasters';
import { UsrConns } from './usrConns';
import { AccTypeMasters } from './accTypeMasters';
import { Organizations } from './organizations';
import { Accounts } from './accounts';
import { RoleMasters } from './roleMasters';
import { AccRoles } from './accRoles';
import { CashBooks } from './cashBooks';

TypeMasters.hasMany(Users, {foreignKey: 'TypeId'});
Users.belongsTo(TypeMasters, {foreignKey: 'TypeId'});

GenderMasters.hasMany(Users, {foreignKey: 'GenderId'});
Users.belongsTo(GenderMasters, {foreignKey: 'GenderId'});

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
