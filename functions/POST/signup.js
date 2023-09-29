const { db } = require('../../services/db');
const  uuid  = require('uuid');

//const AWS = require('aws-sdk');


//create an account and save it to databese.
exports.handler = async (event, context) => {
    try {
        const requestBody = JSON.parse(event.body);
        const AccountId = uuid.v4();

        const params = {
            TableName: 'Accounts',
            Item: {
                AccountId,
                username: requestBody.username,
                password: requestBody.password,
            },
        };

        await db.put(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Account created'}),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};


