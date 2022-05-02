/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const env = process.env.ENV;
const AppsyncID = process.env.API_INSTAGRAM_GRAPHQLAPIIDOUTPUT;
const TableName = `User-${AppsyncID}-${env}`; // TableName-AppsyncID-env

const userExists = async (id) => {
	const params = {
		TableName,
		Key: id,
	};

	try {
		const response = await docClient.get(params).promise();
		return !!response?.Item; //if not null false undefined return true
	} catch (e) {
		return false;
	}
};

const saveUser = async (user) => {
	const date = new Date();
	const dateStr = date.toISOString();
	const timestamp = date.getTime();

	const Item = {
		...user,
		__typename: 'User',
		createdAt: dateStr,
		updatedAt: dateStr,
		_version: 1,
		_lastChangedAt: timestamp,
	};

	const params = {
		TableName,
		Item,
	};

	try {
		await docClient.put(params).promise();
	} catch (e) {
		console.log('error save user:>>', e);
	}
};

exports.handler = async (event, context) => {
	console.log('Hey, Lambda function is working');
	console.log('events:>>', event);

	if (!event?.request?.userAttributes) {
		console.log('No user data available');
		return;
	}

	const { sub, email, name } = event.request.userAttributes;

	const newUser = {
		id: sub,
		email,
		name,
	};

	// check if user already exists
	if (!(await userExists(newUser.id))) {
		// if not, save the user to database
		await saveUser(newUser);
		console.log(`User ${newUser.id} has been saved to database`);
	} else {
		console.log(`User ${newUser.id} already exists`);
	}

	return event;
};
