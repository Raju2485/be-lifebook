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
import { Journals } from './journals';

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

Accounts.hasMany(Journals, { as: 'Debitor', foreignKey: 'DebitorId' });
Journals.belongsTo(Accounts, { as: 'Debitor', foreignKey: 'DebitorId' });

Accounts.hasMany(Journals, { as: 'Creditor', foreignKey: 'CreditorId' });
Journals.belongsTo(Accounts, { as: 'Creditor', foreignKey: 'CreditorId' });

Accounts.hasMany(Journals, { as: 'BookKeeper', foreignKey: 'BkId' });
Journals.belongsTo(Accounts, { as: 'BookKeeper', foreignKey: 'BkId' });

Organizations.hasMany(Journals, { foreignKey: 'OrgId' });
Journals.belongsTo(Organizations, { foreignKey: 'OrgId' });

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
  Journals,
};
