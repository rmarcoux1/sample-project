#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { SampleProjectStack } from '../lib/sample-project-stack';

const app = new cdk.App();
new SampleProjectStack(app, 'SampleProjectStack');
