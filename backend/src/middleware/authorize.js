export const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ errors: { auth: 'Unauthenticated' } });
  }
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ errors: { auth: 'Forbidden: insufficient role' } });
  }
  next();
};
