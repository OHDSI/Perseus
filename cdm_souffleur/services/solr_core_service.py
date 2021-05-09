from shutil import rmtree, copytree, copyfile
import os
from cdm_souffleur.utils.constants import SOLR_PATH, SOLR_CREATE_MAIN_INDEX_CORE, SOLR_FULL_DATA_IMPORT, SOLR_CREATE_CORE, SOLR_RELOAD_CORE, SOLR_UNLOAD_CORE
from os import path
from urllib.request import urlopen
from cdm_souffleur import app


def run_solr_command(command, current_user = ''):
    urlopen(f"http://{app.config['SOLR_HOST']}:{app.config['SOLR_PORT']}/{command}{current_user}")


run_solr_command(SOLR_CREATE_MAIN_INDEX_CORE)
run_solr_command(SOLR_FULL_DATA_IMPORT)


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
