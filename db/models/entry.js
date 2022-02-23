'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Entry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Entry.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmpty: false,
        },
      },
      text: DataTypes.TEXT,
      sound: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Entry',
    },
  );
  return Entry;
};
