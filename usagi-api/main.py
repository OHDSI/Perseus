import create_tables_rows
from app import app
from config import PORT
from create_tables import create_usagi2_tables, create_usagi_tables
from service.web_socket_service import socket
from usagi_api import usagi


app.register_blueprint(usagi)

if __name__ == '__main__':
    create_usagi_tables()
    create_usagi2_tables()
    create_tables_rows.create_valid_concept_ids()
    create_tables_rows.create_concept_id_to_atc_code()
    create_tables_rows.create_maps_to_relationship()
    create_tables_rows.create_relationship_atc_rxnorm()
    create_tables_rows.create_atc_to_rxnorm()
    create_tables_rows.create_parent_child_relationship()
    create_tables_rows.create_parent_count()
    create_tables_rows.create_child_count()
    create_tables_rows.create_usagi_concept()
    create_tables_rows.create_concept_for_index()
    create_tables_rows.create_concept_for_index_2()
    create_tables_rows.create_concept_for_index_3()
    create_tables_rows.create_concept_for_index_4()
    socket.run(app, port=PORT, host='0.0.0.0')