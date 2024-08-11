import { Construct } from 'constructs';
import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ssm from 'aws-cdk-lib/aws-ssm';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AkatsukiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const akatsukiLayer = new lambda.LayerVersion(
      this, 'AkatsukiLayer', {
        code: lambda.Code.fromAsset('layers'),
        compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
        description: 'A layer to test the L2 construct',
      }
    );

    // Lambda functions
    const setsuGetsuKa = new lambda.Function(
      this, 'SetsuGetsuKa', {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'app.handler',
        functionName: 'SetsuGetsuKa',
        code: lambda.Code.fromAsset('lambdas/setsugetsuka'),
        layers: [akatsukiLayer],
        timeout: cdk.Duration.seconds(29),
      }
    );

    setsuGetsuKa.addToRolePolicy(new iam.PolicyStatement({
      actions: ['ssm:GetParameter'],
      resources: ['arn:aws:ssm:ap-northeast-1:275819092422:parameter/keix/api-key/gemini'],
    }));

    const tsukiKage = new lambda.Function(
      this, 'TsukiKage', {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'app.handler',
        functionName: 'TsukiKage',
        code: lambda.Code.fromAsset('lambdas/tsukikage'),
        layers: [akatsukiLayer],
        timeout: cdk.Duration.seconds(29),
      }
    );

    tsukiKage.addToRolePolicy(new iam.PolicyStatement({
      actions: ['ssm:GetParameter'],
      resources: ['arn:aws:ssm:ap-northeast-1:275819092422:parameter/keix/api-key/openai'],
    }));

  }
}
