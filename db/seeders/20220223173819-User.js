'use strict';
const crypto = require('crypto');

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const stat = await queryInterface.sequelize.query(
      'select id from "Statuses";',
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    );
    const users = 'Агафья,Митрофанишна,Митенька,Сашуня'
      .split(',')
      .map((el, ind) => ({
        login: el,
        email: `${el}@a.ru`,
        password: crypto.createHash('sha256').update('123').digest('hex'),
        statusId: stat[Math.floor(ind / 2)].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    await queryInterface.bulkInsert('Users', users, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});
  },
};
