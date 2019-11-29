#!/usr/bin/env bash

set -e

SCRIPT_NAME=`basename $0`
if [ $# -ne 3 ]; then
  echo "Usage: ${SCRIPT_NAME} <environment> <s3_bucket> <region>"
  exit 1
fi

ENV_DEPLOY=$1
S3_BUCKET=$2
REGION=$3
TEMPLATE_NAME=template
STACK_NAME=large-text-understanding

sam build --region ${REGION} --template ${TEMPLATE_NAME}.yaml

sam package --s3-bucket ${S3_BUCKET} --s3-prefix ${TEMPLATE_NAME} --region ${REGION} \
  --output-template-file ${TEMPLATE_NAME}-${ENV_DEPLOY}-packaged.yaml

sam deploy \
  --template-file ${TEMPLATE_NAME}-${ENV_DEPLOY}-packaged.yaml \
  --stack-name ${STACK_NAME}-${ENV_DEPLOY} \
  --capabilities CAPABILITY_IAM \
  --region ${REGION} \
  --no-fail-on-empty-changeset
