import { Request, Response, NextFunction } from 'express';
import { UnauthenticatedError } from '../errors/not-authenticated.error';

export function checkAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(req.session);
  if (!req.session || !req.session.user) {
    throw new UnauthenticatedError('Not authenticated. Please log in first');
  }
  next();
}

export function checkNotAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.session && req.session.user) {
    return res.json({ msg: 'Can not log in or register if already logged in' });
  }
  next();
}
