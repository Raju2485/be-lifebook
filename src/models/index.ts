import { TypeMasters } from './typeMasters';
import { GenderMasters } from './genderMasters';
import { Users } from './users';
import { AccessAndRefreshTokens } from './accessAndRefreshTokens';
import { RelationMasters } from './relationMasters';
import { UsrConns } from './usrConns';
import { Organizations } from './organizations';
import { Accounts } from './accounts';
import { RoleMasters } from './roleMasters';
import { Journals } from './journals';
import { CarriedForwards } from './carriedForwards';
import { Cards } from './cards';
import { Documents } from './documents';
import { FinalAccs } from './finalAccs';
import { Months } from './months';
import { Years } from './years';
import { KeysAndLabels } from './keysAndLabels';
import { AccCategs } from './accCategs';
import { Staff } from './staff';
import { StaffRoles } from './staffRoles';

TypeMasters.hasMany(Users, { foreignKey: 'TypeId' });
Users.belongsTo(TypeMasters, { foreignKey: 'TypeId' });

GenderMasters.hasMany(Users, { foreignKey: 'GenderId' });
Users.belongsTo(GenderMasters, { foreignKey: 'GenderId' });

Users.belongsToMany(Users, {
  as: 'Connections',
  through: UsrConns,
  foreignKey: 'UserId',
  otherKey: 'ConnId',
});
Users.belongsToMany(Users, {
  as: 'Users',
  through: UsrConns,
  foreignKey: 'ConnId',
  otherKey: 'UserId',
});

RelationMasters.hasMany(UsrConns, { foreignKey: 'RelId' });
UsrConns.belongsTo(RelationMasters, { foreignKey: 'RelId' });

Users.hasMany(Accounts, { foreignKey: 'UserId' });
Accounts.belongsTo(Users, { foreignKey: 'UserId' });

Organizations.hasMany(Accounts, { foreignKey: 'OrgId' });
Accounts.belongsTo(Organizations, { foreignKey: 'OrgId' });

AccCategs.hasMany(Accounts, { foreignKey: 'AccCategId' });
Accounts.belongsTo(AccCategs, { foreignKey: 'AccCategId' });

//#region Super many to many association
Users.belongsToMany(Organizations, {
  through: Staff,
  foreignKey: 'UserId',
  otherKey: 'OrgId',
});
Organizations.belongsToMany(Users, {
  through: Staff,
  foreignKey: 'OrgId',
  otherKey: 'UserId',
});

Users.hasMany(Staff, {
  foreignKey: 'UserId',
});
Staff.belongsTo(Users, {
  foreignKey: 'UserId',
});

Organizations.hasMany(Staff, {
  foreignKey: 'OrgId',
});
Staff.belongsTo(Organizations, {
  foreignKey: 'OrgId',
});
//#endregion

//#region Super many to many association
Staff.belongsToMany(RoleMasters, {
  through: StaffRoles,
  foreignKey: 'StaffId',
  otherKey: 'RoleId',
});
RoleMasters.belongsToMany(Staff, {
  through: StaffRoles,
  foreignKey: 'RoleId',
  otherKey: 'StaffId',
});

Staff.hasMany(StaffRoles, {
  foreignKey: 'StaffId',
});
StaffRoles.belongsTo(Staff, {
  foreignKey: 'StaffId',
});

RoleMasters.hasMany(StaffRoles, {
  foreignKey: 'RoleId',
});
StaffRoles.belongsTo(RoleMasters, {
  foreignKey: 'RoleId',
});
//#endregion

Accounts.hasMany(Journals, { as: 'Debtor', foreignKey: 'DebtorId' });
Journals.belongsTo(Accounts, { as: 'Debtor', foreignKey: 'DebtorId' });

Accounts.hasMany(Journals, { as: 'Creditor', foreignKey: 'CreditorId' });
Journals.belongsTo(Accounts, { as: 'Creditor', foreignKey: 'CreditorId' });

Accounts.hasMany(Journals, { as: 'BookKeeper', foreignKey: 'BkId' });
Journals.belongsTo(Accounts, { as: 'BookKeeper', foreignKey: 'BkId' });

Organizations.hasMany(Journals, { foreignKey: 'OrgId' });
Journals.belongsTo(Organizations, { foreignKey: 'OrgId' });

Accounts.hasMany(CarriedForwards, { foreignKey: 'AccountId' });
CarriedForwards.belongsTo(Accounts, { foreignKey: 'AccountId' });

FinalAccs.hasOne(Documents, { foreignKey: 'DocumentId' });
Documents.belongsTo(FinalAccs, { foreignKey: 'DocumentId' });

Months.hasMany(Journals, { foreignKey: 'MonthId' });
Journals.belongsTo(Months, { foreignKey: 'MonthId' });

Years.hasMany(Journals, { foreignKey: 'YearId' });
Journals.belongsTo(Years, { foreignKey: 'YearId' });

Months.hasMany(CarriedForwards, { foreignKey: 'MonthId' });
CarriedForwards.belongsTo(Months, { foreignKey: 'MonthId' });

Years.hasMany(CarriedForwards, { foreignKey: 'YearId' });
CarriedForwards.belongsTo(Years, { foreignKey: 'YearId' });

export default {
  TypeMasters,
  GenderMasters,
  Users,
  AccessAndRefreshTokens,
  RelationMasters,
  UsrConns,
  Organizations,
  Accounts,
  RoleMasters,
  Journals,
  CarriedForwards,
  Cards,
  Documents,
  FinalAccs,
  Months,
  Years,
  KeysAndLabels,
  AccCategs,
  Staff,
  StaffRoles,
};
