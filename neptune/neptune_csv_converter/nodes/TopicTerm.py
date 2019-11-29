from .Node import Node


class TopicTerm(Node):
    def __init__(self, name):
        super().__init__('term', name)
