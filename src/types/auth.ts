export type StaffAndRoles = {
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
  staffAndRoles: StaffAndRoles[];
};

export type JwtUserPayload = RequestMeta & {
  iat?: number;
  exp?: number;
};
