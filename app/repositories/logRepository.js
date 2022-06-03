const { logusers } = require('../models')

module.exports = {
  createLog(dataArgs) {
    return logusers.create(dataArgs)
  },
}
