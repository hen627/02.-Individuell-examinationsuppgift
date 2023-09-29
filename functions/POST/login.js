const { db } = require('../../services/db');
const jwt = require('jsonwebtoken');


exports.handler = async (event, context) => {
    try {
        const requestBody = JSON.parse(event.body);
        const user = await await db.query({
            TableName: "Accounts",
            IndexName: "Usernames", 
            KeyConditionExpression: 'username = :username',
            FilterExpression: 'password = :password',
            ExpressionAttributeValues: {
                ':username': requestBody.username,
                ':password': requestBody.password,
            }
        }).promise();

        if (user.Items.length > 0) {
            const token = jwt.sign({username: requestBody.username}, 'h3ll0', { expiresIn:'1m'});

            return {token};}

        else return false;
    } catch (error) {
        console.log(error);
    }
}

