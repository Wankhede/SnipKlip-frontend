import { NextApiRequest, NextApiResponse } from 'next';
// types
import { KanbanColumn } from 'types/kanban';
const itemIdsData = {
  item1: `1`,
  item2: `2`,
  item3: `3`,
  item4: `4`,
  item5: `5`,
  item6: `6`,
  item7: `7`,
  item8: `8`,
  item9: `9`,
  item10: `10`
};

const columnIdsData = {
  column1: 'column-1',
  column2: 'column-2',
  column3: 'column-3'
};
export const columnsData: KanbanColumn[] = [
  {
    id: columnIdsData.column1,
    title: 'New',
    itemIds: ['1']
  },
  {
    id: columnIdsData.column2,
    title: 'Active',
    itemIds: ['2']
  },
  {
    id: columnIdsData.column3,
    title: 'Closed',
    itemIds: ['3','4']
  }
];
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({ columns: columnsData });
}
