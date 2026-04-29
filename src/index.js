const express = require('express');
const bodyParser = require('body-parser');

const { PORT, DB_SYNC } = require('./config/server_config');
const apiRoutes = require('./routes/index');

const db = require('./models/index');

const app = express();

const prepareAndStartServer = () => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.use('/api', apiRoutes);

    app.listen(PORT, async () => {
        console.log(`Server Started on Port: ${PORT}`);
        if(DB_SYNC === 'True') {
            db.sequelize.sync({alter: true});
        }
    });
}   

prepareAndStartServer();
