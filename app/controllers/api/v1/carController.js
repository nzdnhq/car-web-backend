const carService = require('../../../services/carService')
const logService = require('../../../services/logService')

module.exports = {
  async findcar(req, res) {
    // check query empty
    if (
      req.query.time == null &&
      req.query.date == null &&
      req.query.capacity == null
    ) {
      try {
        const cars = await carService.listAll()
        res.status(200).json({
          status: 'OK',
          cars,
        })
      } catch (err) {
        res.status(400).json({
          status: 'FAIL',
          message: err.message,
        })
      }
      // check query not empty
    } else {
      let time = req.query.time
      let date = req.query.date
      let capacity = req.query.capacity
      let newDate = new Date(`${date}T${time}Z`)
      let temp = []
      let info = ''
      try {
        // ---------------------------filter car
        const carData = await carService.listAll()
        carData.forEach((element) => {
          if (
            element.availableat >= newDate &&
            element.capacity > capacity &&
            element.available == true
          ) {
            temp.push(element)
          }
        })
        // -------------------------insert into log users
        var iterator = temp.values()
        for (let elements of iterator) {
          await logService.createLog({
            idusers: req.Users.id,
            idcars: elements.id,
          })
        }
        // ---------------------------check isi temp
        if (temp.length <= 0) {
          info = 'Mobil tidak ditemukan'
        } else {
          info = 'mobil ditemukan'
        }
        // -----------------------------print respon status
        res.status(200).json({
          status: 'OK',
          message: info,
          data: temp,
        })
      } catch (error) {
        res.status(400).json({
          status: 'FAIL',
          message: error.message,
        })
      }
    }
  },
}
