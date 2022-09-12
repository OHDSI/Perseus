def remove_duplicates(results):
    return [i for n, i in enumerate(results) if i not in results[n + 1:]]