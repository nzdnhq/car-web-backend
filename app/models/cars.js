'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class cars extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      cars.belongsToMany(models.users, {
        through: 'logusers',
        foreignKey: 'idcars',
      })
    }
  }
  cars.init(
    {
      plate: DataTypes.STRING,
      manufacture: DataTypes.STRING,
      model: DataTypes.STRING,
      image: {
        type: DataTypes.STRING,
        get() {
          const image = this.getDataValue('image')
          return image ? 'http://localhost:8000' + image.substring(1) : null
        },
      },
      rentperday: DataTypes.INTEGER,
      capacity: DataTypes.INTEGER,
      description: DataTypes.STRING,
      transmission: DataTypes.STRING,
      type: DataTypes.STRING,
      type: DataTypes.STRING,
      year: DataTypes.STRING,
      options: DataTypes.STRING,
      specs: DataTypes.STRING,
      availableat: DataTypes.DATE,
      available: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'cars',
    },
  )
  return cars
}
