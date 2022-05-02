/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event, context) => {
	console.log('Hey lambda fnc is working');
	console.log(event);

	// insert code to be executed by your lambda trigger
	return event;
};
