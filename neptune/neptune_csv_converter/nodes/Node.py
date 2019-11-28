import uuid

# For XML and RDF
#



class Node:
    RDF_URI_PREFIX = "http://topic-modeling.aws.amazon.com"

    def __init__(self, node_type, node_name):
        self.ident = uuid.uuid4()
        self.node_type = node_type
        self.node_name = node_name
        self.node_uri = f"{self.RDF_URI_PREFIX}/{node_type}/doc/{self.ident.hex}"
        self.extra = None
        self.documents = {}

    def __hash__(self):
        return self.ident

    def __str__(self):
        return f"{self.ident.hex}:{self.node_type}:{self.node_name}"

    @property
    def id(self):
        return self.ident.hex

    @property
    def uri(self):
        return self.node_uri

    @property
    def name(self):
        return self.node_name

    @property
    def type(self):
        return self.node_type

    def in_doc(self, doc):
        doc_name = doc.name
        if doc_name not in self.docs:
            self.docs[doc_name] = doc

    @property
    def docs(self):
        return self.documents
