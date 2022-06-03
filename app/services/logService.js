const logRepository = require('../repositories/logRepository')

module.exports = {
  createLog(data) {
    return logRepository.createLog(data)
  },
}
