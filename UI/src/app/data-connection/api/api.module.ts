/* tslint:disable */
/* eslint-disable */
import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration, ApiConfigurationParams } from './api-configuration';

import { CareSiteControllerService } from './services/care-site-controller.service';
import { CdmSourceControllerService } from './services/cdm-source-controller.service';
import { CohortControllerService } from './services/cohort-controller.service';
import { CohortDefinitionControllerService } from './services/cohort-definition-controller.service';
import { ConceptControllerService } from './services/concept-controller.service';
import { ConceptAncestorControllerService } from './services/concept-ancestor-controller.service';
import { ConceptClassControllerService } from './services/concept-class-controller.service';
import { ConceptRelationshipControllerService } from './services/concept-relationship-controller.service';
import { ConceptSynonymControllerService } from './services/concept-synonym-controller.service';
import { ConditionEraControllerService } from './services/condition-era-controller.service';
import { ConditionOccurrenceControllerService } from './services/condition-occurrence-controller.service';
import { CostControllerService } from './services/cost-controller.service';
import { DeathControllerService } from './services/death-controller.service';
import { DeviceExposureControllerService } from './services/device-exposure-controller.service';
import { DomainControllerService } from './services/domain-controller.service';
import { DoseEraControllerService } from './services/dose-era-controller.service';
import { DrugEraControllerService } from './services/drug-era-controller.service';
import { DrugExposureControllerService } from './services/drug-exposure-controller.service';
import { DrugStrengthControllerService } from './services/drug-strength-controller.service';
import { EpisodeControllerService } from './services/episode-controller.service';
import { EpisodeEventControllerService } from './services/episode-event-controller.service';
import { FactRelationshipControllerService } from './services/fact-relationship-controller.service';
import { LocationControllerService } from './services/location-controller.service';
import { MeasurementControllerService } from './services/measurement-controller.service';
import { MetadataControllerService } from './services/metadata-controller.service';
import { NoteControllerService } from './services/note-controller.service';
import { NoteNlpControllerService } from './services/note-nlp-controller.service';
import { ObservationControllerService } from './services/observation-controller.service';
import { ObservationPeriodControllerService } from './services/observation-period-controller.service';
import { PayerPlanPeriodControllerService } from './services/payer-plan-period-controller.service';
import { PersonControllerService } from './services/person-controller.service';
import { PingControllerService } from './services/ping-controller.service';
import { ProcedureOccurrenceControllerService } from './services/procedure-occurrence-controller.service';
import { ProviderControllerService } from './services/provider-controller.service';
import { RelationshipControllerService } from './services/relationship-controller.service';
import { ScanRequestControllerService } from './services/scan-request-controller.service';
import { ScanRequestLogControllerService } from './services/scan-request-log-controller.service';
import { SourceToConceptMapControllerService } from './services/source-to-concept-map-controller.service';
import { SpecimenControllerService } from './services/specimen-controller.service';
import { TripsControllerService } from './services/trips-controller.service';
import { VisitDetailControllerService } from './services/visit-detail-controller.service';
import { VisitOccurrenceControllerService } from './services/visit-occurrence-controller.service';
import { VocabularyControllerService } from './services/vocabulary-controller.service';

/**
 * Module that provides all services and configuration.
 */
@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [
    CareSiteControllerService,
    CdmSourceControllerService,
    CohortControllerService,
    CohortDefinitionControllerService,
    ConceptControllerService,
    ConceptAncestorControllerService,
    ConceptClassControllerService,
    ConceptRelationshipControllerService,
    ConceptSynonymControllerService,
    ConditionEraControllerService,
    ConditionOccurrenceControllerService,
    CostControllerService,
    DeathControllerService,
    DeviceExposureControllerService,
    DomainControllerService,
    DoseEraControllerService,
    DrugEraControllerService,
    DrugExposureControllerService,
    DrugStrengthControllerService,
    EpisodeControllerService,
    EpisodeEventControllerService,
    FactRelationshipControllerService,
    LocationControllerService,
    MeasurementControllerService,
    MetadataControllerService,
    NoteControllerService,
    NoteNlpControllerService,
    ObservationControllerService,
    ObservationPeriodControllerService,
    PayerPlanPeriodControllerService,
    PersonControllerService,
    PingControllerService,
    ProcedureOccurrenceControllerService,
    ProviderControllerService,
    RelationshipControllerService,
    ScanRequestControllerService,
    ScanRequestLogControllerService,
    SourceToConceptMapControllerService,
    SpecimenControllerService,
    TripsControllerService,
    VisitDetailControllerService,
    VisitOccurrenceControllerService,
    VocabularyControllerService,
    ApiConfiguration
  ],
})
export class ApiModule {
  static forRoot(params: ApiConfigurationParams): ModuleWithProviders<ApiModule> {
    return {
      ngModule: ApiModule,
      providers: [
        {
          provide: ApiConfiguration,
          useValue: params
        }
      ]
    }
  }

  constructor( 
    @Optional() @SkipSelf() parentModule: ApiModule,
    @Optional() http: HttpClient
  ) {
    if (parentModule) {
      throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
    }
    if (!http) {
      throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
      'See also https://github.com/angular/angular/issues/20575');
    }
  }
}
