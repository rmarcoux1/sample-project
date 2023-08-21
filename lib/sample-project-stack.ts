import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as cdk from "aws-cdk-lib/core";
import { Construct } from 'constructs'; 

export class SampleProjectStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

   // Define a GraphQL API
   const api = new appsync.GraphqlApi(this, 'MyAppSyncApi', {
    name: 'my-appsync-api',
    schema: appsync.SchemaFile.fromAsset('graphql/schema.graphql'), // Path to your GraphQL schema
  });

  // Define a Lambda function
  const starwarsLambdaFunction = new lambda.Function(this, 'StarwarsLambdaFunction', {
    runtime: lambda.Runtime.NODEJS_14_X,
    handler: 'starwars.handler',
    code: lambda.Code.fromAsset('lambda'),
  });
  
  const weatherLambdaFunction = new lambda.Function(this, 'WeatherLamdaFunction', {
    runtime: lambda.Runtime.NODEJS_14_X,
    handler: 'weather.handler',
    code: lambda.Code.fromAsset('lambda'),
  });


  // Create a Lambda data source for AppSync

  //Starwars
  const starwarsLambdaDataSource = api.addLambdaDataSource('StarwarsDataSource', starwarsLambdaFunction);

  //Weather
  const weatherLambdaDataSource = api.addLambdaDataSource('WeatherDataSource',weatherLambdaFunction);

  // Define resolver
  const getCharacterResolver = starwarsLambdaDataSource.createResolver('this',{
    typeName: 'Query',
    fieldName: 'getCharacter',
    requestMappingTemplate: appsync.MappingTemplate.fromFile('lib/templates/starwars/starwars-request.vtl'),
    responseMappingTemplate: appsync.MappingTemplate.fromFile('lib/templates/starwars/starwars-response.vtl'),
  });

  const getWeatherResolver = weatherLambdaDataSource.createResolver('that', {
    typeName: 'Query',
    fieldName: 'getWeather',
    requestMappingTemplate: appsync.MappingTemplate.fromFile('lib/templates/weather/weather-request.vtl'),
    responseMappingTemplate: appsync.MappingTemplate.fromFile('lib/templates/weather/weather-response.vtl'),
  });

    // Prints out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl
    });

    // Output the API Key
    new cdk.CfnOutput(this, "AppSyncAPIKey", {
      value: api.apiKey || "No API Key", // Use "No API Key" if there's no API key
    });
  }
}
