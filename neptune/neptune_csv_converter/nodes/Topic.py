from .Node import Node


class Topic(Node):
    def __init__(self, name):
        super().__init__('topic', name)
        self._terms = {}
        self._term_weight = {}

    def have_weighted_term(self, term, weight):
        self._terms[term.name] = term
        self._term_weight[term.name] = weight
        return term, weight


    @property
    def term_weight(self):
        return self._term_weight

    @property
    def terms(self):
        return self._terms
