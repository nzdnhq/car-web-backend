'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class logusers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // logusers.hasMany(models.users, { foreignKey: 'idusers' })
      logusers.belongsTo(models.users, { foreignKey: 'idusers' })
    }
  }
  logusers.init(
    {
      idusers: DataTypes.INTEGER,
      idcars: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'logusers',
    },
  )
  return logusers
}
