import { AccCategsM } from './accCategsM';
import { AccessAndRefreshTokens } from './accessAndRefreshTokens';
import { Accounts } from './accounts';
import { Cards } from './cards';
import { CarriedForwards } from './carriedForwards';
import { Connections } from './connections';
import { Documents } from './documents';
import { FinalAccs } from './finalAccs';
import { FriendsAndFams } from './friendsAndFams';
import { GendersM } from './gendersM';
import { Journals } from './journals';
import { KeysAndLabels } from './keysAndLabels';
import { MonthsM } from './monthsM';
import { Organizations } from './organizations';
import { RelationsM } from './relationsM';
import { RolesM_TypesM_J } from './rolesM_typesM_J';
import { RolesM } from './rolesM';
import { StaffJ } from './staffJ';
import { StaffRolesJ } from './staffRolesJ';
import { TypesM } from './typesM';
import { Users } from './users';
import { YearsM } from './yearsM';

Users.hasMany(Connections, { foreignKey: 'ConnUserId' });
Connections.belongsTo(Users, { foreignKey: 'ConnUserId' });

Connections.hasOne(FriendsAndFams, { foreignKey: 'ConnectionId' });
FriendsAndFams.belongsTo(Connections, { foreignKey: 'ConnectionId' });

TypesM.hasMany(Users, { foreignKey: 'TypesM_Id' });
Users.belongsTo(TypesM, { foreignKey: 'TypesM_Id' });

GendersM.hasMany(Users, { foreignKey: 'GendersM_Id' });
Users.belongsTo(GendersM, { foreignKey: 'GendersM_Id' });


//#region Super many to many association
RolesM.belongsToMany(TypesM, {
  through: RolesM_TypesM_J,
  foreignKey: 'RolesM_Id',
  otherKey: 'TypesM_Id',
});
TypesM.belongsToMany(RolesM, {
  through: RolesM_TypesM_J,
  foreignKey: 'TypesM_Id',
  otherKey: 'RolesM_Id',
});

RolesM.hasMany(RolesM_TypesM_J, {
  foreignKey: 'RolesM_Id',
});
RolesM_TypesM_J.belongsTo(RolesM, {
  foreignKey: 'RolesM_Id',
});

TypesM.hasMany(RolesM_TypesM_J, {
  foreignKey: 'TypesM_Id',
});
RolesM_TypesM_J.belongsTo(TypesM, {
  foreignKey: 'TypesM_Id',
});
//#endregion

Users.hasMany(Accounts, { foreignKey: 'UserId' });
Accounts.belongsTo(Users, { foreignKey: 'UserId' });

Organizations.hasMany(Accounts, { foreignKey: 'OrgId' });
Accounts.belongsTo(Organizations, { foreignKey: 'OrgId' });

AccCategsM.hasMany(Accounts, { foreignKey: 'AccCategsM_Id' });
Accounts.belongsTo(AccCategsM, { foreignKey: 'AccCategsM_Id' });

//#region Super many to many association
Users.belongsToMany(Organizations, {
  through: StaffJ,
  foreignKey: 'UserId',
  otherKey: 'OrgId',
});
Organizations.belongsToMany(Users, {
  through: StaffJ,
  foreignKey: 'OrgId',
  otherKey: 'UserId',
});

Users.hasMany(StaffJ, {
  foreignKey: 'UserId',
});
StaffJ.belongsTo(Users, {
  foreignKey: 'UserId',
});

Organizations.hasMany(StaffJ, {
  foreignKey: 'OrgId',
});
StaffJ.belongsTo(Organizations, {
  foreignKey: 'OrgId',
});
//#endregion

//#region Super many to many association
StaffJ.belongsToMany(RolesM, {
  through: StaffRolesJ,
  foreignKey: 'StaffJ_Id',
  otherKey: 'RolesM_Id',
});
RolesM.belongsToMany(StaffJ, {
  through: StaffRolesJ,
  foreignKey: 'RolesM_Id',
  otherKey: 'StaffJ_Id',
});

StaffJ.hasMany(StaffRolesJ, {
  foreignKey: 'StaffJ_Id',
});
StaffRolesJ.belongsTo(StaffJ, {
  foreignKey: 'StaffJ_Id',
});

RolesM.hasMany(StaffRolesJ, {
  foreignKey: 'RolesM_Id',
});
StaffRolesJ.belongsTo(RolesM, {
  foreignKey: 'RolesM_Id',
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

MonthsM.hasMany(Journals, { foreignKey: 'MonthsM_Id' });
Journals.belongsTo(MonthsM, { foreignKey: 'MonthsM_Id' });

YearsM.hasMany(Journals, { foreignKey: 'YearsM_Id' });
Journals.belongsTo(YearsM, { foreignKey: 'YearsM_Id' });

MonthsM.hasMany(CarriedForwards, { foreignKey: 'MonthsM_Id' });
CarriedForwards.belongsTo(MonthsM, { foreignKey: 'MonthsM_Id' });

YearsM.hasMany(CarriedForwards, { foreignKey: 'YearsM_Id' });
CarriedForwards.belongsTo(YearsM, { foreignKey: 'YearsM_Id' });

export default {
AccCategsM,
AccessAndRefreshTokens,
Accounts,
Cards,
CarriedForwards,
Connections,
Documents,
FinalAccs,
FriendsAndFams,
GendersM,
Journals,
KeysAndLabels,
MonthsM,
Organizations,
RelationsM,
RolesM_TypesM_J,
RolesM,
StaffJ,
StaffRolesJ,
TypesM,
Users,
YearsM,
};
