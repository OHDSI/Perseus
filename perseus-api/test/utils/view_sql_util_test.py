import unittest

from utils.view_sql_util import start_with_select_or_with, contains_schema_names, add_schema_names


class ViewSqlUtilTest(unittest.TestCase):
    def test_start_with_select(self):
        query1 = 'SELECT id FROM'
        query2 = 'select name FROM'
        query3 = 'Select * FROM'
        query4 = 'INSERT SELECT * FROM'
        query5 = 'select t1.id,\nt1.gender,\nt2.lorem_ipsum\nfrom lower as t1\njoin test_data as t2 on t1.id = t2.id'

        query6 = 'WITH TEST AS'
        query7 = 'With Test As'
        query8 = 'with test as'

        self.assertTrue(start_with_select_or_with(query1))
        self.assertTrue(start_with_select_or_with(query2))
        self.assertTrue(start_with_select_or_with(query3))
        self.assertFalse(start_with_select_or_with(query4))
        self.assertTrue(start_with_select_or_with(query5))

        self.assertTrue(start_with_select_or_with(query6))
        self.assertTrue(start_with_select_or_with(query7))
        self.assertTrue(start_with_select_or_with(query8))

    def test_not_contains_schema_name(self):
        query1 = 'SELECT * FROM schema.table'
        query2 = 'SELECT * FROM "schema".table'
        query3 = 'SELECT * FROM table'

        schemas = ['schema']

        self.assertTrue(contains_schema_names(query1, schemas))
        self.assertTrue(contains_schema_names(query2, schemas))
        self.assertFalse(contains_schema_names(query3, schemas))

    def test_add_schema_names(self):
        schema_name = 'test'
        query1 = 'select * from lower join "UPPER" on lower.id = "UPPER"."ID"'
        query2 = 'select * from  lower Join  "UPPER" on lower.id = "UPPER"."ID"'
        query3 = 'select * from\nlower Join\n"UPPER" on lower.id = "UPPER"."ID"'

        tables = ['lower', 'UPPER']

        result1 = add_schema_names(schema_name, query1, tables)
        result2 = add_schema_names(schema_name, query2, tables)
        result3 = add_schema_names(schema_name, query3, tables)

        expected_result = f'select * from {schema_name}.lower join {schema_name}."UPPER" on lower.id = "UPPER"."ID"'

        self.assertEqual(expected_result, result1)
        self.assertEqual(expected_result, result2)
        self.assertEqual(expected_result, result3)


if __name__ == '__main__':
    unittest.main()
