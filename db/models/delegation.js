'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Delegation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  Delegation.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      delegateeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Delegation',
    },
  );
  return Delegation;
};
