function parseArrowKey(key) {
  const ids = key.split('/');
  const sourceTableRowIds = ids[0];
  const targetTableRowIds = ids[1];

  return {
    ids: key.split('/'),
    sourceTableRowIds: ids[0],
    targetTableRowIds: ids[1],
    sourceTableId: sourceTableRowIds.split('-')[0],
    targetTableId: targetTableRowIds.split('-')[0]
  };
}

export { parseArrowKey };
