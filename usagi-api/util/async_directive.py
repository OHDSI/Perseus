import asyncio

from app import app

user_concept_mapping_tasks = {}


def fire_and_forget_concept_mapping(f):
    def wrapped(*args, **kwargs):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        task = asyncio.get_event_loop().run_in_executor(None, f, *args, *kwargs)
        username = args[0]
        user_concept_mapping_tasks[username] = task
        return task
    return wrapped


def cancel_concept_mapping_task(username):
    if user_concept_mapping_tasks[username].cancel():
        app.logger.info("Code Mapping conversion task successfully canceled")
    else:
        app.logger.error("Can not cancel Code Mapping conversion task")
    user_concept_mapping_tasks.pop(username, None)
