const { db } = require('../../services/db');
const jwt = require('jsonwebtoken');
const { validateToken } = require('../../middleware/auth');
const middy = require('@middy/core');

const addQuestionToQuiz = async (event, context) => {
    try {
        const requestBody = JSON.parse(event.body);
        const token = event.headers.authorization.replace('Bearer ', '');
        const decodedToken = jwt.verify(token, 'h3ll0');
        console.log('Decoded Token:', decodedToken);
        const creatorId = decodedToken.username;

        const existingQuiz = await db.get({
            TableName: 'Quiz',
            Key: {
                QuizId: requestBody.quizid,
            },
        }).promise();

        if (!existingQuiz || existingQuiz.Item.creatorId !== creatorId) {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: 'Only quiz creator can add questions.' }),
            };
        }

        const updatedQuiz = {
            ...existingQuiz.Item,
            question: [
                ...existingQuiz.Item.question,
                {
                    question: requestBody.question,
                    answer: {
                        answer: requestBody.answer.answer,
                        long: requestBody.answer.long,
                        lat: requestBody.answer.lat,
                    },
                },
            ],
        };

        const updateParams = {
            TableName: 'Quiz',
            Key: {
                QuizId: requestBody.quizid,
            },
            UpdateExpression: 'SET #question = :question',
            ExpressionAttributeNames: {
                '#question': 'question',
            },
            ExpressionAttributeValues: {
                ':question': updatedQuiz.question,
            },
        };

        await db.update(updateParams).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Quiz updated' }),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Wrong quizId' }),
        };
    }
};

const handler = middy(addQuestionToQuiz);

handler.use(validateToken());

export { handler };
