from db import app_logic_db
from model.etl_mapping import EtlMapping
from model.user_defined_lookup import UserDefinedLookup

app_logic_db.create_tables([EtlMapping, UserDefinedLookup])
