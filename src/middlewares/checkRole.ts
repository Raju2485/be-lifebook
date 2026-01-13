export const checkRole = (rolesArray) => {
    return function (req, res, next) {
        let orgId = req.query.orgId ?? req.body.orgId ?? req.params.orgId ?? null;
        if (!orgId) {
            return res.status(400).json({success: false, msg: 'orgId missing in payload'})
        }
        const org = req.user.orgsAndRoles.find(obj => obj.id == orgId)
        if (!org) {            
            return res.status(400).json({success: false, msg: 'organization not found'})
        }
        console.log('rolesArray = ', rolesArray)
        if (org.roles.some(el => rolesArray.includes(el))) {
            next();
        }
        else { return res.status(403).send("Forbidden"); }
    };
}