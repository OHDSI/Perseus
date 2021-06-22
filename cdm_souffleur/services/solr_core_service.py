import urllib
from shutil import rmtree, copytree, copyfile
import os
from apscheduler.schedulers.background import BackgroundScheduler

from cdm_souffleur.db import pg_db
from cdm_souffleur.utils.constants import SOLR_PATH, SOLR_CREATE_MAIN_INDEX_CORE, SOLR_FULL_DATA_IMPORT, \
    SOLR_CREATE_CORE, SOLR_RELOAD_CORE, SOLR_UNLOAD_CORE, SOLR_IMPORT_STATUS, ATHENA_IMPORT_STATUS, ATHENA_CREATE_CORE, \
    ATHENA_FULL_DATA_IMPORT
from os import path
from urllib.request import urlopen
from cdm_souffleur import app


main_index_created = False
athena_index_created = False
import_status_scheduler = BackgroundScheduler()
import_status_scheduler.start()


def run_solr_command(command, current_user = ''):
    resource = urllib.request.urlopen(f"http://{app.config['SOLR_HOST']}:{app.config['SOLR_PORT']}/{command}{current_user}")
    content = resource.read().decode(resource.headers.get_content_charset())
    return content


def check_index_created(command):
    response = run_solr_command(command)
    if 'Indexing completed.' in response:
        return True
    return False


def update_index_status(command, index_created, job_name):
    if check_index_created(command):
        index_created = True
        import_status_scheduler.remove_job(job_name)


def update_main_index_status():
    global main_index_created
    update_index_status(SOLR_IMPORT_STATUS, main_index_created, 'import_status')


def update_athena_index_status():
    global athena_index_created
    update_index_status(ATHENA_IMPORT_STATUS, athena_index_created, 'athena_import_status')


def create_index(create_index_command, full_import_command, job_name, scheduler_func):
    run_solr_command(create_index_command)
    run_solr_command(full_import_command)
    import_status_scheduler.add_job(func=scheduler_func, trigger="interval", seconds=10, id=job_name)


def index_tables_created():
    if pg_db.table_exists('mapped_concept', 'cdm'):
        import_status_scheduler.remove_job('db_created')
        create_index(SOLR_CREATE_MAIN_INDEX_CORE, SOLR_FULL_DATA_IMPORT, 'import_status', update_main_index_status)
        create_index(ATHENA_CREATE_CORE, ATHENA_FULL_DATA_IMPORT, 'athena_import_status', update_athena_index_status)


import_status_scheduler.add_job(func=index_tables_created, trigger="interval", seconds=60, id='db_created')


def create_core(current_user):
    core_path = f"{SOLR_PATH}/{current_user}"
    if path.exists(core_path):
        run_solr_command(SOLR_UNLOAD_CORE, current_user)
        rmtree(f"{SOLR_PATH}/{current_user}")
        create_user_core(core_path, current_user)
    else:
        create_user_core(core_path, current_user)
    return True


def create_user_core(core_path, current_user):
    os.makedirs(core_path)
    copytree(f"{SOLR_PATH}/concepts/conf", f"{core_path}/conf")
    run_solr_command(SOLR_CREATE_CORE, current_user)
    os.remove(os.path.join(f"{core_path}/data/index/segments_1"))
    try:
        run_solr_command(SOLR_RELOAD_CORE, current_user)
    except:
        copy_index(core_path, current_user)
        run_solr_command(SOLR_RELOAD_CORE, current_user)
    return True


def copy_index(core_path, current_user):
    file_names = os.listdir(f"{SOLR_PATH}/concepts/data/index")
    for file_name in file_names:
        if file_name != 'write.lock':
            copyfile(os.path.join(f"{SOLR_PATH}/concepts/data/index", file_name), f"{core_path}/data/index/{file_name}")
