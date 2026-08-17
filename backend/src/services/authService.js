import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import dotenv from 'dotenv';
dotenv.config();

const JWT_EXPIRES = '7d';

export const login = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw { status: 401, message: 'Invalid email or password' };
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw { status: 401, message: 'Invalid email or password' };
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};

export const signup = async ({ name, email, password, address }) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) throw { status: 409, message: 'Email already in use' };
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash, address, role: 'user' });
  return { id: user.id, name: user.name, email: user.email, role: user.role };
};

export const updatePassword = async (userId, currentPwd, newPwd) => {
  const user = await User.findByPk(userId);
  if (!user) throw { status: 404, message: 'User not found' };
  const match = await bcrypt.compare(currentPwd, user.password);
  if (!match) throw { status: 400, message: 'Current password is incorrect' };
  const hash = await bcrypt.hash(newPwd, 10);
  await user.update({ password: hash });
  return true;
};
