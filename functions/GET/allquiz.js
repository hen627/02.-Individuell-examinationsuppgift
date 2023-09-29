const { db } = require('../../services/db');
const jwt = require('jsonwebtoken');
const { validateToken } = require('../../middleware/auth');
const middy = require('@middy/core');

const getAllQuizzes = async (event, context) => {
    try {
        const quizz = await db.scan({
            TableName: 'Quiz',
            ProjectionExpression: 'QuizId, creatorId',
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ quizz }),
        };
    } catch (error) {
        console.error('Error:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};

const handler = middy(getAllQuizzes);

handler.use(validateToken());

export { handler };