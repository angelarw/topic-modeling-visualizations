from doc_queries import DocQueries
import os
import logging
import json
import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger()
LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
logger.setLevel(LOG_LEVEL)

S3_BUCKET = os.getenv('S3_BUCKET', 'INFO')
DEFAULT_DOC_LIMIT = 15
s3 = boto3.resource('s3')

s3_client = boto3.client('s3')
'''
Request JSON format for proxy integration
{
    "resource": "Resource path",
    "path": "Path parameter",
    "httpMethod": "Incoming request's method name"
    "headers": {Incoming request headers}
    "queryStringParameters": {query string parameters }
    "multiValueQueryStringParameters": {multivalued query params}
    "pathParameters":  {path parameters}
    "stageVariables": {Applicable stage variables}
    "requestContext": {Request context, including authorizer-returned key-value pairs}
    "body": "A JSON string of the request payload."
    "isBase64Encoded": "A boolean flag to indicate if the applicable request payload is Base64-encode"
}
Response JSON format
{
    "isBase64Encoded": true|false,
    "statusCode": httpStatusCode,
    "headers": { "headerName": "headerValue", ... },
    "body": "..."
}
'''


def lambda_handler(event, context):
    logger.info('Received event: %s', json.dumps(event, indent=2))

    if event["path"] == "/docs":
        return retrieve_docs(event)
    elif event['path'] == '/topics':
        return retrieve_topic_and_terms()
    else:
        return respond(400, {"message": f"resource '{event['path']}' not supported"})


def retrieve_topic_and_terms():
    try:
        response = respond(200, topic_terms())
        return response

    except ClientError as e:
        logging.error(e)
        return respond(500, {"message": str(e)})


def retrieve_docs(event):
    if 'queryType' not in event['queryStringParameters']:
        return respond(400, {"message": "missing queryType parameter"})
    limit = DEFAULT_DOC_LIMIT
    if 'limit' in event['queryStringParameters']:
        limit = int(event['queryStringParameters']['limit'])
    query_type = event['queryStringParameters']['queryType']
    if query_type == 'TopDocumentsByEntities':
        if 'multiValueQueryStringParameters' in event and 'entities' in event['multiValueQueryStringParameters']:
            entity_to_query = event['multiValueQueryStringParameters']['entities']
        elif 'entities' in event['queryStringParameters']:
            entity_to_query = [event['queryStringParameters']['entities']]
        else:
            return respond(400, {"message": "missing query entities"})
        logger.info(f'entities to query: {entity_to_query}')

        try:
            response = respond(200, top_documents(entity_query=entity_to_query, limit=limit))
            return response

        except ClientError as e:
            logging.error(e)
            return respond(500, {"message": str(e)})
    else:
        return respond(400, {"message": f"queryType '{query_type}' not supported"})


def respond(status_code, data):
    response = {}
    response["isBase64Encoded"] = False
    response["statusCode"] = status_code
    response["headers"] = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': True,
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key'
    }
    response["body"] = json.dumps(data)
    return response


def topic_terms():
    docqueries = DocQueries()
    nodes, edges = docqueries.find_topic_and_terms()
    data = {
        'nodes': nodes,
        'links': edges
    }
    return data


def top_documents(entity_query, limit):
    docqueries = DocQueries()
    nodes, edges = docqueries.find_top_documents_and_its_edges(entity_query, limit)
    # nodes = docqueries.find_document_with_topic(['005'], limit)
    # return nodes
    result_json = f'/tmp/neptune-top-{limit}-doc.json'

    data = {
        'nodes': nodes,
        'links': edges
    }

    with open(result_json, 'w') as outfile:
        json.dump(data, outfile, indent=2)

    s3_key = f'neptune-results/top_{limit}_docs_by_entities.json'
    s3.Bucket(S3_BUCKET).upload_file(result_json, s3_key)
    s3_url = create_presigned_url(bucket_name=S3_BUCKET, object_name=s3_key)
    return {
        's3url': s3_url
    }


def create_presigned_url(bucket_name, object_name, expiration=3600):
    """Generate a presigned URL to share an S3 object

    :param bucket_name: string
    :param object_name: string
    :param expiration: Time in seconds for the presigned URL to remain valid
    :return: Presigned URL as string. If error, returns None.
    """

    # Generate a presigned URL for the S3 object
    response = s3_client.generate_presigned_url('get_object',
                                                Params={'Bucket': bucket_name,
                                                        'Key': object_name},
                                                ExpiresIn=expiration)
    # The response contains the presigned URL
    return response
