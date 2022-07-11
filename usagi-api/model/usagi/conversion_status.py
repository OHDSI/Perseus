from enum import Enum


class ConversionStatus(Enum):
    INITIALIZED = 0
    IN_PROGRESS = 1
    COMPLETED = 2
    ABORTED = 3
    FAILED = 4