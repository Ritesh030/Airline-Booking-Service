const express = require('express');
const v1Routes = require('./v1');

const apiRoutes = express.Router();

apiRoutes.use('/v1', v1Routes);

module.exports = apiRoutes