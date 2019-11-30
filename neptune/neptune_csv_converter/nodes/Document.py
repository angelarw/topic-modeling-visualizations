from .Node import Node
from .Topic import Topic

class Document(Node):
    def __init__(self, name):
        super().__init__('document', name)
        self._topics = {}
        self._topic_weight = {}

    def have_weighted_topic(self, topic, weight):
        self._topics[topic.name] = topic
        self._topic_weight[topic.name] = weight
        return topic, weight

    @property
    def topic_weight(self):
        return self._topic_weight

    @property
    def topics(self):
        return self._topics
