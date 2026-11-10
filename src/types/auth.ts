export type OrgAndRole = {
  id: number | string;
  name: string;
  isAdmin: boolean;
  isMember: boolean;
  roles: string[];
};

export type RequestMeta = {
  id: number;
  name: string;
  surName: string | null;
  email: string | null;
  orgsAndRoles: OrgAndRole[];
};

export type JwtUserPayload = RequestMeta & {
  iat?: number;
  exp?: number;
};
