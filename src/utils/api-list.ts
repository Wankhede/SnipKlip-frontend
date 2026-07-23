/**
 * Safe accessors for SnipKlip list API envelopes:
 *   { data: { count, rows }, status: 200|true, message }
 * Error bodies often look like { message, status: 400|404 } with no `data`.
 */

export type ApiListData<T = any> = {
  count: number;
  rows: T[];
};

export function getApiListData<T = any>(response: any): ApiListData<T> | null {
  const status = response?.data?.status;
  const data = response?.data?.data;
  const ok = status === 200 || status === true || status === '200';
  if (!ok || !data || !Array.isArray(data.rows)) {
    return null;
  }
  return {
    count: Number(data.count ?? data.rows.length) || 0,
    rows: data.rows as T[]
  };
}

export function getApiFirstRow<T = any>(response: any): T | null {
  const list = getApiListData<T>(response);
  return list?.rows?.[0] ?? null;
}
