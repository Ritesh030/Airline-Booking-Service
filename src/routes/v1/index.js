const express = require('express');
const { create } = require('../../controllers/booking_controller');

const v1Routes = express.Router();

v1Routes.post('/booking', create)

module.exports = v1Routes