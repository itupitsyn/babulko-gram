'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Status, { foreignKey: 'statusId' });
      this.hasMany(models.Entry, { foreignKey: 'userId' });
      this.belongsToMany(models.User, {
        through: models.Delegation,
        as: 'Delegator',
        foreignKey: 'userId',
      });
      this.belongsToMany(models.User, {
        through: models.Delegation,
        as: 'Delegatee',
        foreignKey: 'delegateeId',
      });
    }
  }
  User.init(
    {
      login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(64),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      statusId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'User',
    },
  );
  return User;
};
