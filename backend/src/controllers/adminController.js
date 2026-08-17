import {
  getDashboardStats,
  listUsers,
  listStores,
  getUserById,
} from '../services/adminService.js';
import User from '../models/user.js';
import Store from '../models/store.js';
import bcrypt from 'bcryptjs';

export const dashboardCtrl = async (req, res, next) => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
};

export const createUserCtrl = async (req, res, next) => {
  try {
    const { name, email, password, address, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, address, role: role || 'user' });
    const { password: _, ...safe } = user.get({ plain: true });
    res.status(201).json({ user: safe });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ errors: { email: 'Email already in use' } });
    }
    next(err);
  }
};

export const createStoreCtrl = async (req, res, next) => {
  try {
    const { name, email, address, owner_id } = req.body;
    // Verify owner exists and is an owner
    const owner = await User.findByPk(owner_id);
    if (!owner || owner.role !== 'owner') {
      return res.status(400).json({ errors: { owner_id: 'owner_id must reference a user with role owner' } });
    }
    const store = await Store.create({ name, email, address, owner_id });
    res.status(201).json({ store });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ errors: { email: 'Store email already in use' } });
    }
    next(err);
  }
};

export const listUsersCtrl = async (req, res, next) => {
  try {
    const data = await listUsers(req.query);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const listStoresCtrl = async (req, res, next) => {
  try {
    const data = await listStores(req.query);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const userDetailCtrl = async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
};
