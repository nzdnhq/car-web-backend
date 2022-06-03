const { cars } = require('../models')

module.exports = {
  findAll() {
    return cars.findAll()
  },
}
