const BookingRepository = require('../repository/booking_repository')
const { FLIGHT_SERVICE_PATH } = require('../config/server_config')
const axios = require('axios')
const { serverError } = require('../utils/errors')

class BookingService {
      constructor() {
            this.bookingRepository = new BookingRepository()
      }

      async createBooking(data) {
            try {
                  const flightId = data.flightId
                  const getFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flight/${flightId}`
                  const response = await axios.get(getFlightRequestUrl)
                  const flightData = response.data.data
                  let priceOfFlight = flightData.price
      
                  if(data.totalSeats > flightData.totalSeats){
                        throw new serverError('Something went wrong in booking flight', 'Insufficient seats')
                  }

                  const totalPrice = priceOfFlight * data.totalSeats;
                  const bookingPayload = { ...data, totalPrice }

                  const booking = await this.bookingRepository.create(bookingPayload)

                  const updateFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flight/${flightId}`
                  await axios.patch(updateFlightRequestUrl, {totalSeats: flightData.totalSeats - booking.totalSeats})

                  const finalBooking = await this.bookingRepository.update(booking.id, {status: 'Booked'})
                  return finalBooking
            } catch (error) {
                  if(error.name == 'Repository Error' || error.name == 'validationError'){
                        throw error
                  }
                  if (error.response) {
                        throw new serverError(
                              'Flight service request failed',
                              error.response.data?.message || error.message,
                              error.response.status
                        );
                  }
                  throw new serverError(error.message);
            }

      }
}

module.exports = BookingService
