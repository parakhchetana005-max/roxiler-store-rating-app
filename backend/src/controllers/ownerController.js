import { getOwnerDashboard } from '../services/ownerService.js';

export const ownerDashboardCtrl = async (req, res, next) => {
  try {
    const data = await getOwnerDashboard(req.user.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
