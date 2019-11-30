from .Node import Node


class Term(Node):
    def __init__(self, name):
        super().__init__('term', name)
