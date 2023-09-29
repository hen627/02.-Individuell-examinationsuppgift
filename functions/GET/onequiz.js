const { db } = require('../../services/db');
const jwt = require('jsonwebtoken');
const { validateToken } = require('../../middleware/auth');
const middy = require('@middy/core');

const getQuizById = async (event, context) => {
    try {

        const creatorId = event.pathParameters.userId;
        const quizId = event.pathParameters.quizId;

        const quiz = await db.get({
            TableName: 'Quiz',
            Key: {
                QuizId: quizId,
            },
        }).promise();

        if (!quiz || quiz.Item.creatorId !== creatorId) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Quiz not found' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ quiz: quiz.Item.QuizId }),
        };
    } catch (error) {
        console.error('Error:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Invalid path' }),
        };
    }
};

const handler = middy(getQuizById);

handler.use(validateToken());

export { handler };
