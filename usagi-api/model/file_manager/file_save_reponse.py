from dataclasses import dataclass


@dataclass
class FileSaveResponse:
    id: int
    username: str
    dataKey: str
    fileName: str
    filePath: str or None


def from_json(json: dict):
    return FileSaveResponse(
        id=json['id'],
        username=json['username'],
        dataKey=json['dataKey'],
        fileName=json['fileName'],
        filePath=None
    )
