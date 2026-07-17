import { FC, Fragment } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

// third-party
import {
  useFilters,
  useExpanded,
  useGlobalFilter,
  useRowSelect,
  useSortBy,
  useTable,
  usePagination,
  Column,
  HeaderGroup,
  Row,
  Cell,
} from 'react-table';

// project import
import { CSVExport, HeaderSort, TablePagination, TableRowSelection } from 'components/third-party/ReactTable';

import { GlobalFilter } from 'utils/react-table';

// assets
interface Props {
    tableId: string;    
    columns: Column[];
    data: [];
    renderRowSubComponent: FC<any>;
    addButton?: JSX.Element;
}
export default function ReactTable({ tableId, columns, data, renderRowSubComponent, addButton }: Props) {
    const theme = useTheme();
    const sortBy = { id: tableId, desc: false };
  
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      visibleColumns,
      rows,
      page,
      gotoPage,
      setPageSize,
      state: { globalFilter, selectedRowIds, pageIndex, pageSize },
      preGlobalFilteredRows,
      setGlobalFilter,
    } = useTable(
      {
        columns,
        data,
        initialState: { pageIndex: 0, pageSize: 5, sortBy: [sortBy] }
      },
      useGlobalFilter,
      useFilters,
      useSortBy,
      useExpanded,
      usePagination,
      useRowSelect
    );
  
  
    return (
      <>
        <TableRowSelection selected={Object.keys(selectedRowIds).length} />
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 3, pb: 0 }}>
            <Stack direction="row">
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                size="small"
              />
              <CSVExport data={data} filename={'invoice-list.csv'} />
            </Stack>
            {addButton && <Stack direction="row" alignItems="center" spacing={1}>
              {addButton}
            </Stack>}
          </Stack>
  
          <Table {...getTableProps()}>
            <TableHead>
              {headerGroups.map((headerGroup: HeaderGroup<{}>, index: number) => (
                <TableRow {...headerGroup.getHeaderGroupProps()} key={index} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                  {headerGroup.headers.map((column: HeaderGroup, i: number) => (
                    <TableCell {...column.getHeaderProps([{ className: column.className }])} key={i}>
                      <HeaderSort column={column} sort />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps()}>
              {page.map((row: Row, i: number) => {
                prepareRow(row);
                const rowProps = row.getRowProps();
  
                return (
                  <Fragment key={i}>
                    <TableRow
                      {...row.getRowProps()}
                      onClick={() => {
                        row.toggleRowSelected();
                      }}
                      sx={{ cursor: 'pointer', bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit' }}
                    >
                      {row.cells.map((cell: Cell, index: number) => (
                        <TableCell {...cell.getCellProps([{ className: cell.column.className }])} key={index}>
                          {cell.render('Cell')}
                        </TableCell>
                      ))}
                    </TableRow>
                    {row.isExpanded && renderRowSubComponent({ row, rowProps, visibleColumns })}
                  </Fragment>
                );
              })}
              <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
                <TableCell sx={{ p: 2, py: 3 }} colSpan={9}>
                  <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Stack>
      </>
    );
  }
  