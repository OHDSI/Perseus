import unittest

from util.searh_util import search_term_to_query


class SearchUtilTest(unittest.TestCase):
    def test_search_term_to_query(self):
        term1 = 'Pulse'
        term2 = 'BP - Diastolic'
        term3 = ''
        term4 = 'BP\nDiastolic'
        term5 = 'BP\tDiastolic'

        query1 = search_term_to_query(term1)
        query2 = search_term_to_query(term2)
        query3 = search_term_to_query(term3)
        query4 = search_term_to_query(term4)
        query5 = search_term_to_query(term5)

        self.assertEqual(f"term:Pulse", query1)
        self.assertEqual(f"term:(BP - Diastolic)", query2)
        self.assertEqual("*:*", query3)
        self.assertEqual(f"term:(BP\nDiastolic)", query4)
        self.assertEqual(f"term:(BP\tDiastolic)", query5)


if __name__ == '__main__':
    unittest.main()
