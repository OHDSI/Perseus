class SourceCode:
    def __init__(self, source_code = '',  source_name = '', source_frequency = 0, source_auto_assigned_concept_ids = set(), source_additional_info = [], code = {}):
        self.source_code = source_code
        self.source_name = source_name
        self.source_frequency = source_frequency
        self.source_auto_assigned_concept_ids = source_auto_assigned_concept_ids
        self.source_additional_info = source_additional_info
        self.code = code

