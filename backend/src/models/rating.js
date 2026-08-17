import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import User from './user.js';
import Store from './store.js';

class Rating extends Model {}

Rating.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    store_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Rating',
    tableName: 'ratings',
    indexes: [{ unique: true, fields: ['user_id', 'store_id'] }],
  }
);

Rating.belongsTo(User, { foreignKey: 'user_id' });
Rating.belongsTo(Store, { foreignKey: 'store_id' });
User.hasMany(Rating, { foreignKey: 'user_id' });
Store.hasMany(Rating, { foreignKey: 'store_id' });

export default Rating;
