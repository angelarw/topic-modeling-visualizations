from .Node import Node


class Topic(Node):
    def __init__(self, name):
        super().__init__('topic', name)
