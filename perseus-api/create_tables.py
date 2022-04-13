from db import app_logic_db
from model.etl_mapping import EtlMapping

app_logic_db.create_tables([EtlMapping])
