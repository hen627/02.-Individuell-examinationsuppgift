const { db } = require('../../services/db');
const jwt = require('jsonwebtoken');
const { validateToken } = require('../../middleware/auth');
const middy = require('@middy/core');

const deleteQuiz = async (event, context) => {
    try {
        const token = event.headers.authorization.replace('Bearer ', '');
        const decodedToken = jwt.verify(token, 'h3ll0');
        console.log('Decoded Token:', decodedToken);
        const creatorId = decodedToken.username;
        const quizId = event.pathParameters.quizId; 

        const existingQuiz = await db.get({
            TableName: 'Quiz',
            Key: {
                QuizId: quizId,
            },
        }).promise();

        if (!existingQuiz || existingQuiz.Item.creatorId !== creatorId) {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: 'You are not the creator' }),
            };
        }

        const deleteParams = {
            TableName: 'Quiz',
            Key: {
                QuizId: quizId,
            },
        };

        await db.delete(deleteParams).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Quiz removed' }),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Unauthorized' }),
        };
    }
};

const handler = middy(deleteQuiz);

handler.use(validateToken());

export { handler };
