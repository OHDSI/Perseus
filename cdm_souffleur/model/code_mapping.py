from json import JSONEncoder
import json
from cdm_souffleur.model.source_code import SourceCode
from enum import Enum
from cdm_souffleur.model.concept import *

class MappingStatus(str, Enum):
    APPROVED = "APPROVED"
    UNCHECKED = "UNCHECKED"
    AUTO_MAPPED = "AUTO_MAPPED"
    AUTO_MAPPED_TO_1 = "AUTO_MAPPED_TO_1"
    INVALID_TARGET = "INVALID_TARGET"
    FLAGGED = "FLAGGED"
    IGNORED = "IGNORED"

class Equivalence(str, Enum):
    EQUAL = "EQUAL"
    EQUIVALENT = "EQUIVALENT"
    WIDER = "WIDER"
    NARROWER = "NARROWER"
    INEXACT = "INEXACT"
    UNMATCHED = "UNMATCHED"
    UNREVIEWED = "UNREVIEWED"

class Type(str, Enum):
    MAPS_TO = "MAPS_TO"
    MAPS_TO_VALUE = "MAPS_TO_VALUE"
    MAPS_TO_UNIT = "MAPS_TO_UNIT"


class TargetConcept:
    def __init__(self, conceptId=0, conceptName="Unmapped", conceptClassId = '', vocabularyId = '',
                 conceptCode = '', domainId = '', validStartDate = '', validEndDate = '', invalidReason='',
                 standardConcept = "", additionalInformation = "", parentCount = 0, childCount = 0):
        self.conceptId = conceptId
        self.conceptName = conceptName
        self.conceptClassId = conceptClassId
        self.vocabularyId = vocabularyId
        self.conceptCode = conceptCode
        self.domainId = domainId
        self.validStartDate = validStartDate
        self.validEndDate = validEndDate
        self.invalidReason = invalidReason
        self.standardConcept = standardConcept
        self.additionalInformation = additionalInformation
        self.parentCount = parentCount
        self.childCount = childCount


class ScoredConcept:
    def __init__(self, match_score=0, concept=TargetConcept(), term = ''):
        self.match_score = match_score
        self.concept = concept
        self.term = term


class MappingTarget:
    def __init__(self, concept=TargetConcept(), mappingType=Type.MAPS_TO, createdBy = '', createdTime = 0):
        self.concept = concept
        self.mappingType = mappingType
        self.createdBy = createdBy
        self.createdTime = createdTime


class CodeMapping:
    def __init__(self, source_code = SourceCode(),
                 matchScore = 0,
                 mappingStatus = MappingStatus.UNCHECKED,
                 equivalence = Equivalence.UNREVIEWED,
                 targetConcepts = [],
                 comment = '',
                 statusSetBy = '',
                 statusSetOn = 0,
                 assignedReviewer = ''):
        self.sourceCode = source_code
        self.matchScore = matchScore
        self.mappingStatus = mappingStatus
        self.equivalence = equivalence
        self.targetConcepts = targetConcepts
        self.comment = comment
        self.statusSetBy = statusSetBy
        self.statusSetOn = statusSetOn
        self.assignedReviewer = assignedReviewer

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)


class CodeMappingEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__


class ScoredConceptEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__