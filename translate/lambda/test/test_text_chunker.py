import os

from unittest import TestCase

from src.main import text_chunker

TEST_DATA_DIR = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'data')


class TestTextChunker(TestCase):
    def test_text_chunker(self):
        test_file = os.path.join(TEST_DATA_DIR, '339796.txt')
        segment_size_limit = 5000
        with open(test_file, 'r') as f:
            test_text = f.read()
            output_segments = text_chunker(test_text, segment_size_limit=segment_size_limit)
            print("output:")
            for i, output in enumerate(output_segments):
                len_bytes = len(output.encode('utf-8'))
                print(f'{i}: {len_bytes} bytes, {len(output)} characters')
                print(output)
                self.assertTrue(len_bytes <= segment_size_limit)
