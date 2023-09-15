import session from 'express-session';

export default session({
  secret: process.env.EXPRESS_SESSION_SECRET as string,
  saveUninitialized: false,
  resave: false,
  name: 'sessionId',
  cookie: {
    secure: false,
    httpOnly: true,
  },
});