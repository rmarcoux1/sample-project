import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Runtime }from 'aws-cdk-lib/aws-lambda'
import { GraphqlApi, Resolver, LambdaDataSource, SchemaFile, AppsyncFunction, MappingTemplate } from 'aws-cdk-lib/aws-appsync';
import { Construct } from 'constructs'; 

import * as path from "path"

import { lambdaFunctions } from './lambda-functions';
import { resolvers } from './resolvers';
import { appsyncServiceFunctions } from './appsync-functions';
import { lambdaDataSources } from './lambda-data-sources'; 
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';


export class SampleProjectStack extends Stack {

  private readonly graphqlApi: GraphqlApi;
  private readonly resolvers: { [key: string ]: Resolver }
  private readonly lambdas: { [key:string ]: NodejsFunction }
  private readonly dataSources: { [key:string ]: LambdaDataSource}
  private readonly appsyncFunctions: { [key:string ]: AppsyncFunction}

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.graphqlApi = this.configureGraphqlApi();
    this.lambdas  = this.configureLambdas();
    this.dataSources = this.configureDataSources();
    this.appsyncFunctions = this.configureAppsyncFunctions();
    this.resolvers = this.configureResolvers();
  }
  
  private configureGraphqlApi(): GraphqlApi {

    const graphqlApi = new GraphqlApi(this, "GraphqlApi", {
      name: 'my-appsync-api',
      schema: SchemaFile.fromAsset('src/schema/schema.graphql'),
    });

    return graphqlApi;
  }

  private configureLambdas(): { [key: string ]: NodejsFunction } {

    const lambdasFunctions: { [ key: string ]: NodejsFunction } = {};
    for (const [ functionName, lambdaFunctionProps ] of Object.entries(lambdaFunctions)) {
      const { entry, ...lambdaProps } = lambdaFunctionProps;
    
      const lambdaFunction = new NodejsFunction(this, functionName, {
        handler: "handler",
        entry: path.join(__dirname, `../src/lambdas/${entry ?? ""}`),
        runtime: Runtime.NODEJS_14_X,
        timeout: Duration.seconds(30),
        ...lambdaProps
      });

      lambdasFunctions[functionName] = lambdaFunction;
    }

    return lambdasFunctions;
  }

  private configureDataSources(): { [ key:string ]: LambdaDataSource } {
    return {
      ...this.configureLambdaDataSources()
    };
  }

  private configureLambdaDataSources(): { [ key:string ]: LambdaDataSource } {
    const lambdaSources: { [key:string ]: LambdaDataSource } = {};

    Object.entries(lambdaDataSources).forEach(([functionName, lambdaDataSource]) => {
      
      const lambdaFunction: NodejsFunction = this.lambdas[ functionName ];
      if (lambdaFunction == null) {
        throw new Error(`Could not find a lambda function for ${functionName} data source`)
      }

      const lambdaSource = new LambdaDataSource( this, `${functionName}DataSource`, {
        api: this.graphqlApi,
        description: lambdaDataSource.description,
        name: `${lambdaDataSource.name}`,
        lambdaFunction: lambdaFunction
      });

      lambdaFunction.grantInvoke(lambdaSource);
      lambdaSources[functionName] = lambdaSource;
    });

    return lambdaSources;
  }

  private configureAppsyncFunctions(): { [key:string ]: AppsyncFunction } {

    const appsyncFunctions: { [key:string ]: AppsyncFunction } = {};

    Object.entries(appsyncServiceFunctions).forEach(([functionName, details]) => {
      const dataSource = this.dataSources[details.lambdaDataSourceName]

      if (dataSource == null) {
        throw new Error(`Could not find a dataSource: ${details.lambdaDataSourceName} for Appsync ${functionName} `)
      }

      appsyncFunctions[functionName] = new AppsyncFunction(this, `${functionName}AppsyncFunction`, {
        api: this.graphqlApi,
        dataSource: dataSource,
        name: `${functionName}`,
        requestMappingTemplate: MappingTemplate.fromFile(`lib/templates/${details.requestMappingTemplate}.vtl`),
        responseMappingTemplate:  MappingTemplate.fromFile(`lib/templates/${details.responseMappingTemplate}.vtl`)
      })
    });

    return appsyncFunctions;
  }

  private configureResolvers(): { [key:string ]: Resolver } {
    const allResolvers: { [key:string]: Resolver } = {}; 

    resolvers.forEach((details) => {
      details.types.forEach((type) => {
        details.fieldNames.forEach((fieldName) => {
          allResolvers[`${type}${fieldName}`] = new Resolver(this, `${type}${fieldName}Resolver`, {
            api: this.graphqlApi,
            typeName: type,
            fieldName: fieldName,
            requestMappingTemplate: MappingTemplate.fromFile(`lib/templates/${details.requestMappingTemplate}.vtl`),
            responseMappingTemplate: MappingTemplate.fromFile(`lib/templates/${details.responseMappingTemplate}.vtl`),

            ...(details.dataSourceName && { dataSource: this.dataSources[details.dataSourceName] })
            
          });
        });
      });
    });

    return allResolvers;
  }
}
