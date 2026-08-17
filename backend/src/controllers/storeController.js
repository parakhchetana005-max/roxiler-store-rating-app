import Store from '../models/store.js';
import Rating from '../models/rating.js';
import User from '../models/user.js';
import { Op, fn, col } from 'sequelize';

const iLike = (val) => ({ [Op.like]: `%${val}%` });

export const listStoresCtrl = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      order = 'DESC',
      name,
      address,
    } = req.query;

    const allowedSortFields = ['name', 'address', 'created_at'];
    const safeSort = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const safeOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const where = {};
    if (name) where.name = iLike(name);
    if (address) where.address = iLike(address);

    const { rows, count } = await Store.findAndCountAll({
      where,
      order: [[safeSort, safeOrder]],
      offset: (Number(page) - 1) * Number(limit),
      limit: Number(limit),
    });

    const storesWithRatings = await Promise.all(
      rows.map(async (store) => {
        const avgResult = await Rating.findOne({
          attributes: [[fn('AVG', col('rating')), 'avg']],
          where: { store_id: store.id },
          raw: true,
        });
        let myRating = null;
        let myRatingId = null;
        if (req.user) {
          const existing = await Rating.findOne({
            where: { store_id: store.id, user_id: req.user.id },
          });
          myRating = existing?.rating ?? null;
          myRatingId = existing?.id ?? null;
        }
        return {
          ...store.get({ plain: true }),
          averageRating: avgResult?.avg ? parseFloat(avgResult.avg).toFixed(2) : '0.00',
          myRating,
          myRatingId,
        };
      })
    );

    res.json({ stores: storesWithRatings, total: count, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
};

export const submitRatingCtrl = async (req, res, next) => {
  try {
    const { rating } = req.body;
    const storeId = req.params.id;

    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ errors: { store: 'Store not found' } });

    const [ratingRecord, created] = await Rating.findOrCreate({
      where: { user_id: req.user.id, store_id: storeId },
      defaults: { rating, user_id: req.user.id, store_id: storeId },
    });

    if (!created) {
      await ratingRecord.update({ rating });
    }

    res.status(created ? 201 : 200).json({ rating: ratingRecord });
  } catch (err) {
    next(err);
  }
};

export const updateRatingCtrl = async (req, res, next) => {
  try {
    const { rating } = req.body;
    const storeId = req.params.id;

    const existing = await Rating.findOne({
      where: { user_id: req.user.id, store_id: storeId },
    });
    if (!existing) return res.status(404).json({ errors: { rating: 'No rating found. Submit first.' } });

    await existing.update({ rating });
    res.json({ rating: existing });
  } catch (err) {
    next(err);
  }
};
