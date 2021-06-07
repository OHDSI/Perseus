import asyncio

def fire_and_forget(f):
    def wrapped(*args, **kwargs):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        return asyncio.get_event_loop().run_in_executor(None, f, *args, *kwargs)
    return wrapped