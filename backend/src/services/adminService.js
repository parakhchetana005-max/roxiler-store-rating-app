import User from '../models/user.js';
import Store from '../models/store.js';
import Rating from '../models/rating.js';
import { Op, fn, col, literal } from 'sequelize';

// SQLite uses LIKE (case-insensitive by default for ASCII), not ILIKE
const iLike = (val) => ({ [Op.like]: `%${val}%` });

export const getDashboardStats = async () => ({
  totalUsers: await User.count(),
  totalStores: await Store.count(),
  totalRatings: await Rating.count(),
});

export const listUsers = async (query) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'created_at',
    order = 'DESC',
    name,
    email,
    address,
    role,
  } = query;

  const allowedSortFields = ['name', 'email', 'address', 'role', 'created_at'];
  const safeSort = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
  const safeOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const where = {};
  if (name) where.name = iLike(name);
  if (email) where.email = iLike(email);
  if (address) where.address = iLike(address);
  if (role) where.role = role;

  const { rows, count } = await User.findAndCountAll({
    where,
    attributes: { exclude: ['password'] },
    order: [[safeSort, safeOrder]],
    offset: (Number(page) - 1) * Number(limit),
    limit: Number(limit),
  });
  return { users: rows, total: count, page: Number(page), limit: Number(limit) };
};

export const listStores = async (query) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'created_at',
    order = 'DESC',
    name,
    email,
    address,
  } = query;

  const allowedSortFields = ['name', 'email', 'address', 'created_at'];
  const safeSort = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
  const safeOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const where = {};
  if (name) where.name = iLike(name);
  if (email) where.email = iLike(email);
  if (address) where.address = iLike(address);

  const { rows: stores, count } = await Store.findAndCountAll({
    where,
    include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }],
    order: [[safeSort, safeOrder]],
    offset: (Number(page) - 1) * Number(limit),
    limit: Number(limit),
  });

  const storesWithRating = await Promise.all(
    stores.map(async (store) => {
      const result = await Rating.findOne({
        attributes: [[fn('AVG', col('rating')), 'avg']],
        where: { store_id: store.id },
        raw: true,
      });
      return {
        ...store.get({ plain: true }),
        averageRating: result?.avg ? parseFloat(result.avg).toFixed(2) : '0.00',
      };
    })
  );

  return { stores: storesWithRating, total: count, page: Number(page), limit: Number(limit) };
};

export const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] },
    include: [{ model: Store, as: 'store' }],
  });
  if (!user) throw { status: 404, message: 'User not found' };

  let averageRating = null;
  if (user.role === 'owner' && user.store) {
    const result = await Rating.findOne({
      attributes: [[fn('AVG', col('rating')), 'avg']],
      where: { store_id: user.store.id },
      raw: true,
    });
    averageRating = result?.avg ? parseFloat(result.avg).toFixed(2) : '0.00';
  }
  return { ...user.get({ plain: true }), averageRating };
};
