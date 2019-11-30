import cfnresponse
import json
import logging
import boto3
import random
import string

from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

es_client = boto3.client('es')
cognito_idp_client = boto3.client('cognito-idp')


# Generates a random ID
def id_generator(size=12, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


def configure_cognito_lambda_handler(event, context):
    logger.info("Received event: %s" % json.dumps(event))

    try:
        if event['RequestType'] == 'Create':
            create(event)
            cfnresponse.send(event, context, cfnresponse.SUCCESS, {})
        if event['RequestType'] == 'Update':
            cfnresponse.send(event, context, cfnresponse.SUCCESS, {})
        elif event['RequestType'] == 'Delete':
            result_status = delete(event)
            cfnresponse.send(event, context, result_status, {})
    except:
        logger.error("Error", exc_info=True)
        cfnresponse.send(event, context, cfnresponse.FAILED, {})


def create(event):
    user_pool_id = event['ResourceProperties']['UserPoolId']
    username = event['ResourceProperties']['WebappUsername']
    password = event['ResourceProperties']['WebappPassword']
    if 'userEmail' in event['ResourceProperties'] and event['ResourceProperties']['userEmail'] != '':
        user_email = event['ResourceProperties']['userEmail']
    else:
        user_email = id_generator(6) + '@example.com'

    add_user(user_pool_id, username, user_email, password)


def delete(event):
    return cfnresponse.SUCCESS


def add_user(userPoolId, username, user_email, password):
    cognito_response = cognito_idp_client.admin_create_user(
        UserPoolId=userPoolId,
        Username=username,
        UserAttributes=[
            {
                'Name': 'email',
                'Value': user_email
            },
            {
                'Name': 'email_verified',
                'Value': 'True'
            }
        ],
        TemporaryPassword=password,
        MessageAction='SUPPRESS',
        DesiredDeliveryMediums=[
            'EMAIL'
        ]
    )
    return cognito_response
