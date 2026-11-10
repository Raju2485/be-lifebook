import type { JwtUserPayload, RequestMeta } from './auth';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends JwtUserPayload {}
    interface Request {
      user?: User;
      meta?: RequestMeta;
    }
  }
}

export {};
