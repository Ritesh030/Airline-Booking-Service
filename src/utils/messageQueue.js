const amqplib = require('amqplib'); // amqplib is like a client which helps to connect with the rabitMQ server.
const { MESSAGE_BROKER_URL, EXCHANGE_NAME} = require('../config/serverConfig');

const createChannel = async () => {
    try {
        const connection = await amqplib.connect(MESSAGE_BROKER_URL); // to connect to the message broker
        const channel = await connection.createChannel();  // to connect to the queues provided by mb
        await channel.assertExchange(EXCHANGE_NAME, 'direct', false); // helps to distribute the messages to certail queues
        return channel;
    } catch (error) {
        throw error;
    }
}

const subscribeMessage = async (channel, service,  binding_key) => {
    try {
        const applicationQueue = await channel.assertQueue('REMINDER_QUEUE');

        channel.bindQueue(applicationQueue.queue, EXCHANGE_NAME, binding_key);

        channel.consume(applicationQueue.queue, msg => {
            console.log('received data');
            console.log(msg.content.toString());
            const payload = JSON.parse(msg.content.toString());
            service(payload);
            channel.ack(msg);
        });
    } catch (error) {
        throw error;
    }
    
}

const publishMessage = async (channel, binding_key, message) => {
    try {
        await channel.assertQueue('REMINDER_QUEUE');
        await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
    } catch (error) {
        throw error;
    }
}

module.exports = {
    subscribeMessage,
    createChannel,
    publishMessage
}