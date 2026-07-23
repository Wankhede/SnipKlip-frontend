import { NextApiRequest, NextApiResponse } from 'next';
const columnIdsData = {
  column1: 'column-1',
  column2: 'column-2',
  column3: 'column-3'
};
export const columnsOrderData: string[] = [columnIdsData.column1, columnIdsData.column2, columnIdsData.column3];
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({ columnsOrder: columnsOrderData });
}
