export const prependUniqueRow = <T extends { id?: unknown }>(
  rows: T[],
  newRow: T,
  maximumRows: number
): T[] => {
  const withoutExistingRow = rows.filter((row) => row.id !== newRow.id);
  return [newRow, ...withoutExistingRow].slice(0, maximumRows);
};
