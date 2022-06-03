const { users } = require('../models')

module.exports = {
  createRep(dataArgs) {
    return users.create(dataArgs)
  },

  findRep(email) {
    return users.findOne({
      where: { email },
    })
  },

  findPkRep(dataPk) {
    return users.findByPk(dataPk)
  },

  findUser(data) {
    return users.findOne({ where: { googleId: data } })
  },
}
