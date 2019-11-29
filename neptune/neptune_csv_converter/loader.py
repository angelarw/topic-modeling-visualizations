import csv
import json
from json import JSONDecodeError

import click
from nodes.Document import Document, Topic
from nodes.Term import Term
import uuid
import logging

logging.basicConfig()
logger = logging.getLogger()


#
# This routine goes through the JSON files entered and outputs two csv files suitable
# for importing into Neptune. One files define each Node and the other defines the
# vertices.
#
# The nodes can be of the following types:
#
#  - Document
#  - Organization
#  - Location
#  - Person
#
# Whenever we process these we have to create objects of these types and then connect them
# to each other.
#
#
# Once these documents are generated, they have to be copied to the S3 bucket for Neptune and then loaded
# using the CLI command from the EC2 node that has access to the Neptune instance:
#
# curl -X POST \
#     -H 'Content-Type: application/json' \
#     {https://your-neptune-endpoint:port}/loader -d '
#     {
#       "source" : "{s3://bucket-name/object-key-name}",
#       "format" : "csv",
#       "iamRoleArn" : "{arn:aws:iam::account-id:role/role-name}",
#       "region" : "{region}",
#       "failOnError" : "FALSE",
#       "parallelism" : "MEDIUM"
#     }'
#
# The load command will return a job id in this format:
#
#
# {
#     "status" : "200 OK",
#     "payload" : {
#         "loadId" : "ef478d76-d9da-4d94-8ff1-08d9d4863aa5"
#     }
# }
#
# To check the status of the job you can go to this URL and specify the loadID returned above.
#
# curl -G 'https://{your-neptune-endpoint:port}/loader/ef478d76-d9da-4d94-8ff1-08d9d4863aa5'

# The full loading process is documented here:
#     https://docs.aws.amazon.com/neptune/latest/userguide/bulk-load-data.html
#
#


# Utility routines to help create these types of nodes
#


def get_or_add_topic(top_list, top_name):
    if top_name in top_list:
        top = top_list[top_name]
    else:
        top = Topic(top_name)
        top_list[top_name] = top
    return top


def get_or_add_terms(term_list, term_name):
    if term_name in term_list:
        term = term_list[term_name]
    else:
        term = Term(term_name)
        term_list[term_name] = term
    return term


###############################
# Start of cli
#
@click.command()
@click.option('--verbose', is_flag=True, default=False, help="Will print verbose messages.")
@click.option('--format', type=click.Choice(['csv']), default='csv', help="Output format")
@click.option('--topictermscsv', help='Input to topic terms csv file')
@click.option('--doctopiccsv', help='Input doc to topics csv file')
@click.option('--vertex', default='vertex.csv', help='Name of Vertex CSV file [default=vertex.csv]')
@click.option('--edge', default='edge.csv', help='Name of Edge CSV file [default=edge.csv]')
def cli(verbose, format, topictermscsv, doctopiccsv, output_vertex_file, output_edge_file):
    """
    Command-language processor using Python 'click' library.
    """
    DOCS = {}
    TOPICS = {}
    TERMS = {}

    if verbose:
        logger.setLevel(logging.DEBUG)

    logger.info(f"Loading doc to topics csv file: {doctopiccsv}")

    with open(topictermscsv) as topic_csv:
        csv_reader = csv.reader(topic_csv, delimiter=',')
        ## exclude header row
        headers = next(csv_reader, None)

        for row in csv_reader:
            topic_name = row[0]
            term_name = row[1]
            weight = float(row[2])

            if topic_name in TOPICS:
                current_topic = TOPICS[topic_name]
            else:
                current_topic = Topic(topic_name)
                TOPICS[topic_name] = current_topic

            term = get_or_add_terms(TERMS, term_name)
            current_topic.have_weighted_term(term)
            logger.debug(f"Term: '{term}' in topic: '{current_topic}'")

    with open(doctopiccsv) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')

        ## exclude header row
        headers = next(csv_reader, None)

        for row in csv_reader:
            source_document = row[0]
            topic_name = row[1]
            weight = float(row[2])
            logger.debug(f"Processing data for document: {source_document}")

            if source_document in DOCS:
                current_doc = DOCS[source_document]
            else:
                current_doc = Document(source_document)
                DOCS[source_document] = current_doc
            logger.debug(f"Processing WEIGHTED_TOPIC: '{topic_name}' for document: '{current_doc}'")

            top = get_or_add_topic(TOPICS, topic_name)

            current_doc.have_weighted_topic(top, weight)
            logger.debug(f"Topic: '{top}' in document: '{current_doc}'")
            # if topic_name not in TOPICS:
            #     TOPICS[topic_name] = top
    #
    # At this point we've processed all the document records
    # Now, we loop through and write the vertex and edge files

    logger.info(f" Import Complete. Writing to '{format}' output format.")

    if format == 'csv':
        logger.info(f"Writing Vertex file: {output_vertex_file}")

        with open(output_vertex_file, 'w', newline='') as vertex_file:
            vertex_fieldnames = ['~id',
                                 '~label',
                                 'name:String']
            vertex_writer = csv.DictWriter(vertex_file,
                                           fieldnames=vertex_fieldnames,
                                           quoting=csv.QUOTE_NONNUMERIC)
            vertex_writer.writeheader()

            # We loop through all documents, orgs, locations, and people and create
            # a note for them.
            #

            logger.info(f"Writing Document nodes")

            for doc_name in DOCS:
                doc = DOCS[doc_name]
                vertex_writer.writerow({'~id': doc.id,
                                        '~label': doc.type,
                                        'name:String': doc.name
                                        })
                logger.debug(f"Wrote Doc Node: '{doc}'")

            logger.info(f"Writing Topic nodes")

            for topic_name in TOPICS:
                topic = TOPICS[topic_name]
                vertex_writer.writerow({'~id': topic.id,
                                        '~label': topic.type,
                                        'name:String': topic.name
                                        })
                logger.debug(f"Wrote Top Node: '{topic}'")

            logger.info(f"Writing Term nodes")

            for term_name in TERMS:
                term = TERMS[term_name]
                vertex_writer.writerow({'~id': term.id,
                                        '~label': term.type,
                                        'name:String': term.name
                                        })
                logger.debug(f"Wrote Term Node: '{term}'")

            logger.info(f"Done writing Vertex/Node file.")
            logger.info(f"\nWriting Edge file: {output_edge_file}")

        with open(output_edge_file, 'w', newline='') as edge_file:
            edge_fieldnames = ['~id',
                               '~from',
                               '~to',
                               '~label',
                               'weight:Double', ]
            edge_writer = csv.DictWriter(edge_file, fieldnames=edge_fieldnames)
            edge_writer.writeheader()

            for doc_name in DOCS:
                doc = DOCS[doc_name]

                #  all the Document to Topic edges
                #
                topic_weight = doc.topic_weight
                for topic_name in topic_weight:
                    topic = TOPICS[topic_name]
                    weight = topic_weight[topic_name]
                    edge_writer.writerow({'~id': uuid.uuid4().hex,
                                          '~from': doc.id,
                                          '~to': topic.id,
                                          '~label': 'topic_weight',
                                          'weight:Double': weight})
                    logger.debug(f"Wrote TOP edge: doc: '{doc}' - top: '{topic}' - weight: {weight}")

            for topic_name in TOPICS:
                topic = TOPICS[topic_name]

                term_weight = topic.term_weight
                for term_name in term_weight:
                    term = TERMS[term_name]
                    weight = term_weight[term_name]
                    edge_writer.writerow({'~id': uuid.uuid4().hex,
                                          '~from': term.id,
                                          '~to': weight.id,
                                          '~label': 'topic_weight',
                                          'weight:Double': weight})
                    logger.debug(f"Wrote term edge: topic: '{topic}' - term: '{term}' - weight: {weight}")


if __name__ == '__main__':
    cli()
