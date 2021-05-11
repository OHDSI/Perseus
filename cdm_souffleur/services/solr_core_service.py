import urllib
from shutil import rmtree, copytree, copyfile
import os
from apscheduler.schedulers.background import BackgroundScheduler
from cdm_souffleur.utils.constants import SOLR_PATH, SOLR_CREATE_MAIN_INDEX_CORE, SOLR_FULL_DATA_IMPORT, \
    SOLR_CREATE_CORE, SOLR_RELOAD_CORE, SOLR_UNLOAD_CORE, SOLR_IMPORT_STATUS
from os import path
from urllib.request import urlopen
from cdm_souffleur import app


main_index_created = False
import_status_scheduler = BackgroundScheduler()

def update_main_index_status():
    global main_index_created
    response = run_solr_command(SOLR_IMPORT_STATUS)
    if 'Indexing completed.' in response:
                main_index_created = True
                import_status_scheduler.remove_job('import_status')

import_status_scheduler.add_job(func=update_main_index_status, trigger="interval", seconds=10, id="import_status")


def full_data_import():
    if not main_index_created:
        run_solr_command(SOLR_CREATE_MAIN_INDEX_CORE)
        response = run_solr_command(SOLR_FULL_DATA_IMPORT)
        import_status_scheduler.start()
    else:
        response = 'Main index already created.'
    return response

def run_solr_command(command, current_user = ''):
    resource = urllib.request.urlopen(f"http://{app.config['SOLR_HOST']}:{app.config['SOLR_PORT']}/{command}{current_user}")
    content = resource.read().decode(resource.headers.get_content_charset())
    return content


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
