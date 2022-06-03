const authRepo = require('../repositories/authRepository')

module.exports = {
  createSer(data) {
    return authRepo.createRep(data)
  },

  findSer(dataEmail) {
    return authRepo.findRep(dataEmail)
  },

  findPkSer(dataPk) {
    return authRepo.findPkRep(dataPk)
  },

  findUserGoogle(data) {
    return authRepo.findUser(data)
  },
}
