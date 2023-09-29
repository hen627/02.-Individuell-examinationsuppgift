const { db } = require('../../services/db');
const jwt = require('jsonwebtoken');
const { validateToken } = require('../../middleware/auth');
const middy = require('@middy/core');


const createQuiz = async (event, context) => {
    try {
        const requestBody = JSON.parse(event.body);
        const token = event.headers.authorization.replace('Bearer ', '');
        const decodedToken = jwt.verify(token, 'h3ll0');
        console.log('Decoded Token:', decodedToken);
        const creatorId = decodedToken.username;

        const params = {
            TableName: 'Quiz',
            Item: {
                QuizId: requestBody.quizid,
                creatorId: creatorId,
                question:[{ 
                    question: requestBody.question,
                answer: {
                    answer: requestBody.answer.answer,
                    long: requestBody.answer.long,
                    lat: requestBody.answer.lat,
               
                },
            }]
            },
        };

        await db.put(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Quiz created'}),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};


const handler = middy(createQuiz)

handler.use(validateToken());

export { handler };
