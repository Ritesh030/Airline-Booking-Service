const { StatusCodes } = require("http-status-codes");
const BookingService = require("../service/booking_service");

const bookingService = new BookingService()

const create = async (req,res) => {
      try {
            const booking = await bookingService.createBooking(req.body);
            return res.status(StatusCodes.OK).json({
                  message: 'Booking created',
                  status: true,
                  data: booking,
                  error: []
            })
      } catch (error) {
            return res.status(error.statuscode).json({
                  message: error.message,
                  success: false,
                  err: error.explanation,
                  data: {}
            })
      }
}

module.exports = {
      create
}
