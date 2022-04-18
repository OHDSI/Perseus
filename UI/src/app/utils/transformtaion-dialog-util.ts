import * as conceptFields from '@mapping/concept-fileds-list.json'
import { OverlayConfigOptions } from '@services/overlay/overlay-config-options.interface'
import { IConnection } from '@models/connection'
import { OverlayDialogRef, OverlayService } from '@services/overlay/overlay.service'
import { ChooseTransformationTypePopupComponent } from '@popups/choose-transformation-type-popup/choose-transformation-type-popup.component'
import { TransformConfigComponent } from '@mapping/transform-config/transform-config.component'
import { MatDialog } from '@angular/material/dialog'
import { getLookupType, toLookupRequest } from '@utils/lookup-util'
import { MatDialogRef } from '@angular/material/dialog/dialog-ref'
import { IArrowCache } from '@models/arrow-cache'
import { IRow } from '@models/row'
import { ConceptTransformationComponent } from '@mapping/concept-transformation/concept-transformation.component'
import { TransformationDialogResult } from '@models/transformation-dialog-result'
import { TransformationDialogData } from '@models/transformation-dialog-data'
import { BridgeService } from '@services/bridge.service'
import { PerseusLookupService } from '@services/perseus/perseus-lookup.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { openErrorDialog, parseHttpError } from '@utils/error'
import { Lookup } from '@models/perseus/lookup'
import { SqlForTransformation } from '@models/transformation/sql-for-transformation'
import { Observable } from 'rxjs'

const conceptFieldNames = (conceptFields as any).default;

export function isNoConceptColumn(tableName: string, columnName: string): boolean {
  return !conceptFieldNames[tableName]?.includes(columnName)
}

export function openChooseTransformationTypePopup(overlayService: OverlayService,
                                                  arrow: IConnection,
                                                  htmlElement: Element): OverlayDialogRef<{connectionType: 'L' | 'T'}> {
  const dialogOptions: OverlayConfigOptions = {
    hasBackdrop: true,
    backdropClass: 'custom-backdrop',
    positionStrategyFor: 'transformation-type',
    payload: {
      arrow
    }
  }
  return overlayService.open<{connectionType: 'L' | 'T'}>(dialogOptions, htmlElement, ChooseTransformationTypePopupComponent);
}

export function openTransformationPopup(matDialog: MatDialog,
                                        arrowCache: IArrowCache,
                                        arrow: IConnection,
                                        connectionType: 'L' | 'T'): MatDialogRef<TransformConfigComponent, TransformationDialogResult> {
  const selectedTab = connectionType === 'L' ? 'Lookup' : 'SQL Function';
  const lookupType = getLookupType(arrow);

  return matDialog.open<TransformConfigComponent, TransformationDialogData, TransformationDialogResult>(TransformConfigComponent, {
    closeOnNavigation: false,
    disableClose: true,
    panelClass: 'perseus-dialog',
    data: {
      arrowCache,
      connector: arrow.connector,
      lookup: arrow.lookup,
      lookupType,
      sql: arrow.sql,
      tab: selectedTab
    }
  });
}

export function openConceptTransformationDialog(matDialog: MatDialog,
                                                arrowCache: IArrowCache,
                                                row: IRow,
                                                oppositeSourceTable: string): MatDialogRef<ConceptTransformationComponent, any> {
  return matDialog.open(ConceptTransformationComponent, {
    closeOnNavigation: false,
    disableClose: true,
    panelClass: 'perseus-dialog',
    maxHeight: '100%',
    data: { arrowCache, row, oppositeSourceTable }
  });
}

export function isUpdatedLookup(lookup: Lookup): boolean {
  return !!lookup.id && (!!lookup.source_to_standard || !!lookup.source_to_source) && lookup.originName === lookup.name
}

export function isCreatedLookup(lookup: Lookup): boolean {
  return lookup.originName && lookup.name && lookup.originName !== lookup.name
}

export function handleLookupTransformationResult(lookup: Lookup,
                                                 arrowCacheId: string,
                                                 bridgeService: BridgeService,
                                                 lookupService: PerseusLookupService,
                                                 snackBar: MatSnackBar,
                                                 matDialog: MatDialog): void {
  const isCreated = isCreatedLookup(lookup)
  const isUpdated = isUpdatedLookup(lookup)
  if (isCreated || isUpdated) {
    const lookupRequest = toLookupRequest(lookup)
    const saveLookup$: Observable<Lookup> = isUpdated ?
      lookupService.updateLookup(lookup.id, lookupRequest) :
      lookupService.createLookup(lookupRequest)
    saveLookup$.subscribe(
      savedLookup => {
        bridgeService.arrowsCache[arrowCacheId].lookup = {id: savedLookup.id, name: savedLookup.name, applied: true}
        snackBar.open('Lookup successfully saved!', ' DISMISS ')
      },
      error => openErrorDialog(matDialog, 'Failed to save lookup', parseHttpError(error))
    );
  } else if (lookup.originName || lookup.originName === '') {
    const lookupName = lookup.name ? lookup.name : lookup.originName
    bridgeService.arrowsCache[arrowCacheId].lookup = {id: lookup.id, name: lookupName, applied: true}
  }
}

export function handleSqlTransformationResult(sql: SqlForTransformation, arrow: IConnection): void {
  if (sql.name || sql.name === '') {
    arrow.sql = sql;
    arrow.sql.applied = sql.name !== '';
  }
}
