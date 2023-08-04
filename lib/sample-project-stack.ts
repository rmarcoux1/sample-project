import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import { Construct } from 'constructs';

export class SampleProjectStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "hello.handler",
    });

    const goodbye = new lambda.Function(this, "GoodbyeHandler", {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "goodbye.handler",
    });

    const starwars = new lambda.Function(this, "StarwarsHandler", {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "starwars.handler",
    });

    const weather = new lambda.Function(this, "WeatherHandler", {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "weather.handler",
      environment: {
        API_KEY: '*****'
      },
    });

    const api = new apigateway.RestApi(this, 'MyApi', {
      restApiName: 'My API',
    });

    const helloResource = api.root.addResource('hello');
    helloResource.addMethod('GET', new apigateway.LambdaIntegration(hello));

    const goodbyeResource = api.root.addResource('goodbye');
    goodbyeResource.addMethod('GET', new apigateway.LambdaIntegration(goodbye));

    const starwarsResource = api.root.addResource('starwars');
    starwarsResource.addMethod('GET', new apigateway.LambdaIntegration(starwars));

    const weatherResource = api.root.addResource('weather');
    weatherResource.addMethod('GET', new apigateway.LambdaIntegration(weather));

  }
}
