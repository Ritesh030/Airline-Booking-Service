const { StatusCodes } = require("http-status-codes");
const { Booking } = require("../models/index");
const { validationError, serverError, apiError } = require("../utils/errors");

class BookingRepository {

      async create(data){
            try {
                  const booking = await Booking.create(data);
                  return booking
            } catch (error) {
                  if(error.name == 'SequelizeValidationError'){
                        throw new validationError(error)
                  }
                  throw new apiError("Repository Error", "Cannot create booking", "Something went wrong", StatusCodes.INTERNAL_SERVER_ERROR)
            }
      }

      async update(bookingId, data){
            const booking = await Booking.findByPk(bookingId)
            if(data.status){
                  booking.status = data.status
            }
            await booking.save();
            return booking
      }
}

module.exports = BookingRepository