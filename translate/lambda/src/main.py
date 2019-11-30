import boto3
import json
import logging, os
from botocore.exceptions import ClientError
from aws_xray_sdk.core import xray_recorder
from aws_xray_sdk.core import patch_all
import urllib.parse

patch_all()

LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
TRANSLATED_PREFIX = os.getenv('TRANSLATED_PREFIX', 'Translated/')

logger = logging.getLogger()
logger.setLevel(LOG_LEVEL)

translate_client = boto3.client('translate')

s3 = boto3.resource('s3')

TEXT_SIZE_LIMIT = 4998


def lambda_handler(event, context):
    """Receive SQS messages, process them one by one."""
    logger.debug('Received event: %s', json.dumps(event, indent=2))
    if 'Records' not in event:
        logger.info('No records in event')
        return
    else:
        logger.info('Received {} of records'.format(len(event['Records'])))

    saved_exception = None

    for record in event['Records']:

        try:
            message_body = json.loads(record['body'])
            logger.info('message: ' + json.dumps(message_body, indent=2))
            process_record_individually(message_body)

        # If any error occurs during processing of the record, save the exception but process the other records
        except ClientError as e:
            logger.error(e, exc_info=True)
            saved_exception = e

    if saved_exception is not None:
        raise saved_exception


def process_record_individually(input_payload):
    s3_bucket, s3_key, s3_decoded_key = parse_s3_key(input_payload)
    logger.info(f's3 object: s3://{s3_bucket}/{s3_decoded_key}')

    original_text_str, content_length = download_original_text(s3_bucket, s3_decoded_key)

    if content_length <= TEXT_SIZE_LIMIT:
        translated_text = translate(original_text_str)
    else:
        segments = text_chunker(original_text_str)

        translated_segments = [translate(segment) for segment in segments]
        translated_text = '\n'.join(translated_segments)

    upload_translated_text(translated_text, s3_bucket, s3_key, s3_decoded_key)
    response_payload = {"message": f'successfully processed {input_payload}'}
    return response_payload


def parse_s3_key(s3_event_notification_payload):
    s3_bucket = s3_event_notification_payload['Records'][0]['s3']['bucket']['name']
    s3_encoded_key = s3_event_notification_payload['Records'][0]['s3']['object']['key']
    s3_decoded_key = urllib.parse.unquote_plus(s3_encoded_key)
    return s3_bucket, s3_encoded_key, s3_decoded_key


def download_original_text(s3_bucket, decoded_key):
    obj = s3.Object(s3_bucket, decoded_key)
    content_length = obj.content_length
    s3_file_content = obj.get()['Body'].read().decode('utf-8')
    logger.info('original text: ' + get_first_line(s3_file_content))
    logger.debug(s3_file_content)
    logger.info(f'Original text length: {content_length} bytes; {len(s3_file_content)} characters')
    return s3_file_content, content_length


def upload_translated_text(translated_text, s3_bucket, s3_key, decoded_key):
    s3_key_translated = os.path.join(TRANSLATED_PREFIX, decoded_key)
    logger.info(f's3 object for translated test:: s3://{s3_bucket}/{s3_key_translated}')
    metadata = {'translate-source': f's3://{s3_bucket}/{s3_key}',
                'source-lang': 'zh'}
    s3.Object(bucket_name=s3_bucket, key=s3_key_translated).put(Body=translated_text.encode('utf-8'),
                                                                Metadata=metadata)


def text_chunker(long_text_str, segment_size_limit=TEXT_SIZE_LIMIT):
    lines = long_text_str.splitlines(True)
    segments = []
    current_segment_encoded = b''
    for line in lines:
        line_encoded = line.encode('utf-8')
        if len(current_segment_encoded) + len(line_encoded) < segment_size_limit:
            current_segment_encoded += line_encoded
        else:
            segments.append(current_segment_encoded.decode('utf-8'))
            current_segment_encoded = line_encoded
    # TODO: address if a single paragraph is longer than limit
    if current_segment_encoded:
        segments.append(current_segment_encoded.decode('utf-8'))
    logger.info(f'Chunked original text into {len(segments)} segments')
    return segments


def translate(s3_file_content):
    response = translate_client.translate_text(
        Text=s3_file_content,
        SourceLanguageCode='zh',
        TargetLanguageCode='en'
    )
    translated_text = response['TranslatedText']
    logger.info('translated text: ' + get_first_line(translated_text))
    logger.debug(translated_text)
    logger.debug(response)
    return translated_text


def get_first_line(text):
    return text.partition('\n')[0]
