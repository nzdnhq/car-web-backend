const carRepository = require('../repositories/carRepository')

module.exports = {
  listAll() {
    return carRepository.findAll()
  },
}
