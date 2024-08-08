import { Construct } from 'constructs';
import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';

import * as ec2 from 'aws-cdk-lib/aws-ec2';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AkatsukiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const helloFunction = new lambda.Function(
        this, 'HelloFunction', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'hello.handler',
            functionName: 'HelloFunction',
            code: lambda.Code.fromAsset('lambdas/hello'),
        });

  }
}
