from gremlin_python.process.traversal import *

from neptune import Neptune
from gremlin_python import statics
from gremlin_python.structure.graph import Graph
from gremlin_python.process.graph_traversal import __
from gremlin_python.process.strategies import *
from gremlin_python.driver.driver_remote_connection import DriverRemoteConnection
from gremlin_python.process.traversal import *

import json

DOCUMENT_TYPE_NAME = 'document'


class DocQueries:

    def __init__(self):
        self.neptune = Neptune()
        self.g = self.neptune.graphTraversal()

    def get_document(self, doc_name):
        """
        Retrieve node info with the given name in the format of
        {
            "name": <doc-name>,
            "id": <vertex-id>,
            "type" : "document"
        }
        This assumes there's only one document with a given name
        """
        node = self.g.V().has(DOCUMENT_TYPE_NAME, 'name', doc_name) \
            .project('name', 'id', 'type') \
            .by('name') \
            .by(T.id) \
            .by(T.label) \
            .next()
        return node

    def get_entities(self, query_entities):
        query_entity_nodes = self.g.V() \
            .not_(__.hasLabel(DOCUMENT_TYPE_NAME)) \
            .has('name', within(query_entities)) \
            .project('name', 'id', 'type') \
            .by('name') \
            .by(T.id) \
            .by(T.label) \
            .toList()
        return query_entity_nodes

    def find_top_documents(self, query_entities, limit=10):
        """
        Retrieve a list of top documents most strongly linked to a given set of entities, in the format of
        [{
            "name": <doc-name>,
            "id": <vertex-id>,
            "type" : "document",
            "relavanceScore" : <sum-of-weights-to-query-entities>
        },
        {...},
        ]
        """
        docs_to_weights_map = self.g.V().has('name', within(query_entities)) \
            .inE() \
            .group() \
            .by(__.outV().values('name')) \
            .by(__.unfold().values('weight').sum()) \
            .order(Scope.local) \
            .by(Column.values, Order.decr) \
            .limit(Scope.local, limit) \
            .next()

        nodes = []
        for doc_name, score in docs_to_weights_map.items():
            node = self.get_document(doc_name)
            node['relavanceScore'] = score
            nodes.append(node)

        return nodes

    def find_document_with_topic(self, topic, limit=20):

        result = self.g.V().has('name', within(topic)) \
            .inE().as_('topicEdge') \
            .has('weight', lt(1)) \
            .order().by('weight', Order.decr) \
            .outV().as_('doc') \
            .project('doc', 'topicWeight') \
            .by(__.select('doc').values('name')) \
            .by(__.select('topicEdge').values('weight')) \
            .limit(limit)\
            .toList()

        nodes = []
        for item in result:
            doc_name = item['doc']
            node = self.get_document(doc_name)
            node['relavanceScore'] = item['topicWeight']
            nodes.append(node)

        return nodes

    def get_entities_contained_by_documents(self, doc_names, nodes_to_exclude=[]):
        """
        Retrieve a list of all entities contained by a given list of documents, in the format of
        [{
            "name": <entity-name>,
            "id": <vertex-id>,
            "type" : <entity-type>
        },
        {...},
        ]
        An exclusion list of entities can be supplied to make sure the results do not contain them.
        """
        entity_nodes = self.g.V() \
            .has(DOCUMENT_TYPE_NAME, 'name', within(doc_names)) \
            .outE() \
            .inV().has('name', without(nodes_to_exclude)).dedup() \
            .project('name', 'id', 'type') \
            .by('name') \
            .by(T.id) \
            .by(T.label) \
            .toList()
        return entity_nodes

    def find_edges_for_docs(self, doc_names):
        edges = self.g.V().has(DOCUMENT_TYPE_NAME, 'name', within(doc_names)) \
            .outE() \
            .project('source', 'target', 'value') \
            .by(__.outV().id()) \
            .by(__.inV().id()) \
            .by('weight') \
            .toList()
        return edges

    def find_topic_and_terms(self):
        topic_nodes = self.g.V().hasLabel('topic') \
            .project('name', 'id', 'type') \
            .by('name') \
            .by(T.id) \
            .by(T.label) \
            .toList()
        term_nodes = self.g.V().hasLabel('term') \
            .project('name', 'id', 'type') \
            .by('name') \
            .by(T.id) \
            .by(T.label) \
            .toList()
        all_nodes = topic_nodes + term_nodes
        self.add_type_code(all_nodes)

        all_edges = self.g.E().hasLabel('topic_term_weight') \
            .project('source', 'target', 'value') \
            .by(__.outV().id()) \
            .by(__.inV().id()) \
            .by('weight') \
            .toList()
        return all_nodes, all_edges


    def find_top_documents_and_its_edges(self, query_entities, limit=10):
        query_entity_nodes = self.get_entities(query_entities)
        for node in query_entity_nodes:
            node['queryEntity'] = True

        doc_nodes = self.find_document_with_topic(query_entities, limit)
        doc_names = [node['name'] for node in doc_nodes]
        entity_nodes = self.get_entities_contained_by_documents(doc_names, query_entities)
        all_nodes = doc_nodes + entity_nodes + query_entity_nodes

        all_edges = self.find_edges_for_docs(doc_names)
        self.add_type_code(all_nodes)

        return all_nodes, all_edges

    def add_type_code(self, all_nodes):
        node_types = set([node['type'] for node in all_nodes])
        node_type_code_map = {}
        i = 0
        for node_type in node_types:
            node_type_code_map[node_type] = i
            i += 1
        for node in all_nodes:
            node['group'] = node_type_code_map[node['type']]


def main():
    docqueries = DocQueries()
    limit = 3
    result_json = f'neptune-top-{limit}-doc.json'
    nodes, edges = docqueries.find_top_documents_and_its_edges(query_entities=['000'], limit=limit)

    data = {
        'nodes': nodes,
        'links': edges
    }

    with open(result_json, 'w') as outfile:
        json.dump(data, outfile, indent=2)


if __name__ == '__main__':
    main()
