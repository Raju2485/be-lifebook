import { Request, Response, NextFunction } from 'express';

export const checkRole = (rolesArray: string[]) => {
  return function (req: Request, res: Response, next: NextFunction) {
    const orgId =
      req.query?.OrgId ??
      req.query?.orgId ??
      req.body?.orgId ??
      req.body?.OrgId ??
      req.params?.orgId ??
      req.params?.OrgId ??
      null;
          // console.log('req.user = ', JSON.stringify(req.user));
          // console.log('orgId = ', orgId);
    if (!orgId) {
      return res
        .status(400)
        .json({ success: false, msg: 'orgId is missing in payload' });
    }
    const org = req.user?.staffAndRoles.find((obj) => obj.id == orgId);
    if (!org) {
      return res
        .status(400)
        .json({ success: false, msg: 'organization not mapped' });
    }
    // console.log('org = ', JSON.stringify(org));
    // console.log('rolesArray = ', JSON.stringify(rolesArray));
    if (org.roles.some((el) => rolesArray.includes(el))) {
      next();
    } else {
      return res.status(403).send('Forbidden');
    }
  };
};
