import Store from '../models/store.js';
import Rating from '../models/rating.js';
import User from '../models/user.js';
import { fn, col } from 'sequelize';

export const getOwnerDashboard = async (ownerId) => {
  const store = await Store.findOne({ where: { owner_id: ownerId } });
  if (!store) throw { status: 404, message: 'No store found for this owner. Ask an admin to create one.' };

  const result = await Rating.findOne({
    attributes: [[fn('AVG', col('rating')), 'avg']],
    where: { store_id: store.id },
    raw: true,
  });

  const raters = await Rating.findAll({
    where: { store_id: store.id },
    include: [{ model: User, attributes: ['id', 'name', 'email', 'address'] }],
    order: [['created_at', 'DESC']],
  });

  return {
    store: store.get({ plain: true }),
    averageRating: result?.avg ? parseFloat(result.avg).toFixed(2) : '0.00',
    raters: raters.map((r) => ({
      id: r.id,
      rating: r.rating,
      created_at: r.created_at,
      user: r.User
        ? { id: r.User.id, name: r.User.name, email: r.User.email, address: r.User.address }
        : null,
    })),
  };
};
