import asyncio

user_concept_mapping_tasks = {}


def fire_and_forget_concept_mapping(f):
    def wrapped(*args, **kwargs):
        return create_task(user_concept_mapping_tasks, f, *args, **kwargs)
    return wrapped


def cancel_concept_mapping_task(current_user):
    cancel_task(current_user, user_concept_mapping_tasks)


def create_task(user_tasks, f, *args, **kwargs):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    task = asyncio.get_event_loop().run_in_executor(None, f, *args, *kwargs)
    user_tasks[args[0]] = task
    return task


def cancel_task(current_user, tasks_vocabulary):
    tasks_vocabulary[current_user].cancel()
    tasks_vocabulary.pop(current_user, None)
