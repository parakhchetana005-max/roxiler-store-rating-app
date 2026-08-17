'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const adminHash = await bcrypt.hash('Admin@123', 10);
    const ownerHash = await bcrypt.hash('Owner@123', 10);
    const userHash = await bcrypt.hash('User@123', 10);

    const adminId = uuidv4();
    const ownerId = uuidv4();
    const ownerId2 = uuidv4();
    const ownerId3 = uuidv4();
    const ownerId4 = uuidv4();
    const userId = uuidv4();
    const userId2 = uuidv4();
    const userId3 = uuidv4();

    await queryInterface.bulkInsert('users', [
      {
        id: adminId,
        name: 'Initial Administrator Account',
        email: 'admin@example.com',
        password: adminHash,
        address: '1 Admin Street, City Center, State',
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: ownerId,
        name: 'Owner Account Seeded For Demo',
        email: 'owner@example.com',
        password: ownerHash,
        address: '123 Owner Street, Suburb, State',
        role: 'owner',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: ownerId2,
        name: 'Tech Haven Owner',
        email: 'techhaven@example.com',
        password: ownerHash,
        address: '45 Tech Boulevard',
        role: 'owner',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: ownerId3,
        name: 'Green Grocers Owner',
        email: 'green@example.com',
        password: ownerHash,
        address: '12 Organic Way',
        role: 'owner',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: ownerId4,
        name: 'Bookworm Paradise Owner',
        email: 'books@example.com',
        password: ownerHash,
        address: '88 Library Street',
        role: 'owner',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: userId,
        name: 'Normal User Account For Testing',
        email: 'user@example.com',
        password: userHash,
        address: '456 User Road, District, State',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: userId2,
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: userHash,
        address: '789 Jane Ave',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: userId3,
        name: 'John Smith',
        email: 'john@example.com',
        password: userHash,
        address: '101 John Blvd',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});

    const storeId1 = uuidv4();
    const storeId2 = uuidv4();
    const storeId3 = uuidv4();
    const storeId4 = uuidv4();
    const storeId5 = uuidv4();
    
    await queryInterface.bulkInsert('stores', [
      {
        id: storeId1,
        name: "Owner's Demo Store",
        email: 'store@example.com',
        address: '789 Market Lane, Commercial Zone',
        owner_id: ownerId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: storeId2,
        name: "Tech Haven",
        email: 'contact@techhaven.com',
        address: '45 Tech Boulevard, Silicon District',
        owner_id: ownerId2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: storeId3,
        name: "Green Grocers",
        email: 'fresh@greengrocers.com',
        address: '12 Organic Way, Farm Town',
        owner_id: ownerId3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: storeId4,
        name: "Bookworm Paradise",
        email: 'hello@bookworm.com',
        address: '88 Library Street, Downtown',
        owner_id: ownerId4,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: storeId5,
        name: "Second Branch Tech Haven",
        email: 'branch2@techhaven.com',
        address: '46 Tech Boulevard, Silicon District',
        owner_id: ownerId2,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});

    await queryInterface.bulkInsert('ratings', [
      { id: uuidv4(), rating: 4, user_id: userId, store_id: storeId1, created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), rating: 5, user_id: userId2, store_id: storeId2, created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), rating: 3, user_id: userId3, store_id: storeId2, created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), rating: 5, user_id: userId, store_id: storeId3, created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), rating: 4, user_id: userId2, store_id: storeId4, created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), rating: 4, user_id: userId, store_id: storeId4, created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), rating: 5, user_id: userId3, store_id: storeId5, created_at: new Date(), updated_at: new Date() },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ratings', null, {});
    await queryInterface.bulkDelete('stores', null, {});
    await queryInterface.bulkDelete('users', null, {});
  },
};
