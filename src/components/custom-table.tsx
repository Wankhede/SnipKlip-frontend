import { useCallback, useEffect, useMemo, useState } from 'react';

// material-ui
import { Box, Grid, Skeleton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';

import { Cell, Column, HeaderGroup, Row, useBlockLayout, useColumnOrder, useFilters, useFlexLayout, useGlobalFilter, usePagination, useResizeColumns, useRowSelect, useSortBy, useTable } from 'react-table';


// project import
import ScrollX from 'components/ScrollX';

import {
	CSVExport,
	HidingSelect,
	IndeterminateCheckbox,
	TablePagination,
	TableRowSelection,
} from 'components/third-party/ReactTable';
import { LabelKeyObject } from 'react-csv/components/CommonPropTypes';

import {
	DefaultColumnFilter,
	GlobalFilter,
	renderFilterTypes
} from 'utils/react-table';

//interfaces
import { getTableRowsDataI } from 'types/common';


import { errorColor, successColor } from 'config';
import { EssentialMethods } from 'utils/essentialMethods';
import { useIntl } from 'react-intl';
import _ from 'lodash';
import { useUserProfile } from 'pages/apps/user-provider';
import formatDate from 'utils/date-format';
import { prependUniqueRow } from 'utils/table-state';

export const Error404 = '/assets/images/error404.png/'

// Next Js Routing

// table style
const TableWrapper = styled('div')(({ theme }) => ({
	'.header': {
		position: 'sticky',
		zIndex: 1,
		width: 'fit-content'
	},
	'& th[data-sticky-td]': {
		position: 'sticky',
		zIndex: '5 !important'
	}
}));

interface paginationDataPropsI {
	pageIndex: number
	pageSize?: number,
	// rowCount: number
}

interface EditableRowPropsI {
	value: any;
	row: Row;
	column: any;
	updateData: (index: number, id: string, value: string) => void;
	handleSaveClick: (row: Row, accessor: string, value: any) => Promise<void>;
	editableRowIndex: number;
	nonEditableColumns: string[];
}

interface CustomTablePropsI {
	columns: Column[]
	paginateData?: boolean,
	skipPageReset?: boolean;
	paginationData?: paginationDataPropsI
	getTableRows: (tableParams: getTableRowsDataI | any) => any
	updateTableValues?: (tableData: any) => any
	addButton?: JSX.Element
	bulkUploadButton?: JSX.Element
	top?: boolean
	editable?: boolean
	nonEditableColumns?: string[]
	rowSelection?: boolean
	hiddenColumns?: string[]
	columnResize?: boolean
	filename?: string
	searchColumns: string[]
	prependRow?: any
}

const getFilterValue = (state: { filters: { value: string }[] }, globalFilterValue: string) => {
	if (globalFilterValue) {
		return globalFilterValue;
	} else if (state && state.filters.length > 0) {
		return state.filters[0].value;
	} else {
		return globalFilterValue;
	}
}
// ==============================|| REACT TABLE ||============================== //
const getFilterColumn = (state: { filters: { id: string }[] }, searchColumns: string, globalFilterValue: string) => {
	if (globalFilterValue) {
		return searchColumns;
	} else if (state && state.filters.length > 0) {
		return state.filters[0].id;
	} else {
		return searchColumns;
	}
};

function CustomTable({ columns, paginationData, getTableRows, addButton, bulkUploadButton, paginateData = true, top, editable = false, rowSelection = true, nonEditableColumns = [], updateTableValues = () => { }, hiddenColumns = [], columnResize = false, filename, searchColumns = [], prependRow }: CustomTablePropsI) {
	const theme = useTheme()

	const [rowDetails, setRowDetails] = useState<{}[]>([])

	const getRowId = useCallback((row: any) => row.id, []);

	const [globalFilterValue, setGlobalFilterValue] = useState('');

	const [rowCount, setRowCount] = useState(0)

	const [rowEditLoading, setRowEditLoading] = useState(false);

	const [loadingPage, setLoading] = useState(false);

	const [editableRowIndex, setEditableRowIndex] = useState(null);

	const [skipPageReset, setSkipPageReset] = useState(false);

	const pageIndex = paginationData?.pageIndex ?? 0;
	const pageSize = paginationData?.pageSize ?? 2;

	const filterTypes = useMemo(() => renderFilterTypes, []);

	const defaultColumn = useMemo(() => ({ Filter: DefaultColumnFilter }), []);
	const { userData, loading } = useUserProfile();
	const [selectedRows, setSelectedRows] = useState<Row[]>([]);
	const updateData = (rowIndex: number, columnId: string, value: string | number) => {
		// we also turn on the flag to not reset the page
		setSkipPageReset(true);
		setRowDetails((prevState: any) =>
			prevState.map((row: any, index: any) => {
				if (index === rowIndex) {
					return {
						...(prevState[rowIndex] as {}),
						[columnId]: value
					};
				}
				return row;
			})
		);
	};

	const handleSaveClick = async (row: Row<any>, accessor: string, value: any) => {
		row.original[accessor] = value
		setRowEditLoading(true);
		try {
			const response = await updateTableValues(row.original)

			if (response && response.data.status) {
				EssentialMethods.showSnackbar(response.data.message, successColor)
			}
			else {
				EssentialMethods.showSnackbar(response.data.message, errorColor)
			}
		} catch (error) {
			// Handle any errors that occur during the API call
			console.error('API error:', error);
		} finally {
			setRowEditLoading(false);
		}
	};


	useEffect(() => {
		setSkipPageReset(false);
	}, [rowDetails]);

	useEffect(() => {
		if (prependRow) {
			setRowDetails((currentRows) => prependUniqueRow(currentRows as any[], prependRow, pageSize));
			setRowCount((currentCount) => currentCount + 1);
		}
	}, [prependRow, pageSize]);

	const initialState = useMemo(() => (
		{
			pageIndex,
			pageSize,
			filters: [{ id: 'status', value: '' }],
			hiddenColumns: columns
				.filter((col: Column<{}>) => hiddenColumns.includes(col.accessor as string))
				.map((col) => col.accessor) as string[]
		}), []);
	const intl = useIntl();
	const { getTableProps,
		getTableBodyProps,
		headerGroups,
		footerGroups,
		rows,
		prepareRow,
		state,
		pageCount,
		preGlobalFilteredRows,
		selectedFlatRows,
		setGlobalFilter,
		page,
		gotoPage,
		setPageSize,
		setHiddenColumns,
		allColumns,
	} = useTable(
		{
			columns,
			data: rowDetails,
			defaultColumn,
			initialState,
			filterTypes,
			updateData,
			editableRowIndex,
			setEditableRowIndex,
			nonEditableColumns,
			handleSaveClick,
			autoResetSelectedRows: false,
			getRowId,
			showPagination: paginateData,
			autoResetPage: !skipPageReset,
			manualPagination: true,
			manualFilters: true,
			pageCount: rowCount,
			manualSortBy: true,
		},
		useGlobalFilter,
		useFilters,
		useSortBy,
		useFlexLayout,
		usePagination,
		useRowSelect,
		useColumnOrder,
		(hooks) => {
			if (rowSelection) {
				hooks.allColumns.push((columns: Column[]) => [
					{
						id: 'row-selection-chk',
						accessor: 'Selection',
						className: 'cell-center',
						disableSortBy: true,
						disableFilters: true,
						Header: ({ getToggleAllPageRowsSelectedProps }) => (
							<IndeterminateCheckbox indeterminate {...getToggleAllPageRowsSelectedProps()} />
						),
						Cell: ({ row }: any) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />,
						width: 70
					},
					...columns
				])
			}
		}
	);

	useEffect(() => {
		setLoading(true);
		if (!loading) {
			(async () => {
				const response = await getTableRows({
					page_number: state.pageIndex.toString(), page_size: state.pageSize.toString(), search_value: getFilterValue(state, globalFilterValue),
					search_columns: getFilterColumn(state, searchColumns.toString(), globalFilterValue), sort_by: 'ASC'
				})
				if (response && response.data.status && response.data.data.count > 0) {
					setRowDetails(response.data.data.rows)
					setRowCount(response.data.data.count)
				}
				setLoading(false)
			})()
		}
	}, [state.pageIndex, state.pageSize, globalFilterValue, state.filters])

	useEffect(() => {
		setSelectedRows((preValue) => _.uniqBy(preValue.concat(selectedFlatRows), 'id'));
	}, [state.pageIndex])

	let headers: LabelKeyObject[] = [];

	allColumns.map((item) => {
		if (!state.hiddenColumns?.includes(item.id)) {
			headers.push({ label: item.Header as string, key: item.id });
		}
		return item;
	});
	const formatExcelRowsExport = (rows: Row<{}>[], collectionOfColumnsToRemove: string[]) => {
		rows = _.uniqBy(selectedRows.concat(rows), 'id')
		return rows.map((d: Row) => {
			const modifiedRow: any = _.omit(d.values, collectionOfColumnsToRemove)
			if (modifiedRow.hasOwnProperty('staff_assigned')) {
				if (Array.isArray(modifiedRow.staff_assigned)) {
					modifiedRow.staff_assigned = EssentialMethods.setCategoryValues(modifiedRow.staff_assigned);
				} else if (typeof modifiedRow.staff_assigned === 'object') {
					modifiedRow.staff_assigned = EssentialMethods.setCategoryObjectValues(modifiedRow.staff_assigned);
				}
			}
			if (modifiedRow.hasOwnProperty('service')) {
				if (Array.isArray(modifiedRow.service)) {
					modifiedRow.service = EssentialMethods.setCategoryValues(modifiedRow.service);
				} else if (typeof modifiedRow.service === 'object') {
					modifiedRow.service = EssentialMethods.setCategoryObjectValues(modifiedRow.service);
				}
			}
			if (modifiedRow.hasOwnProperty('date_created')) {
				modifiedRow.date_created = formatDate(modifiedRow.date_created, 'EEE, dd MMM yyyy HH:mm:ss');
			}

			if (modifiedRow.hasOwnProperty('createdAt')) {
				modifiedRow.createdAt = formatDate(modifiedRow.createdAt, 'EEE, dd MMM yyyy');
			}
			return modifiedRow
		})
	}
	const exportHeaders = useMemo(() => {
		let column: any;
		let headersCollection = [];
		for (column of columns) {
			if (column.Header != 'Actions') {
				if (typeof column.Header === 'string') {
					headersCollection.push({ label: column.Header, key: column.accessor })
				}
				else if (typeof column.Header === 'object') {
					headersCollection.push({ label: intl.formatMessage({ id: column.Header.props.id }), key: column.accessor })
				}
			}
		}
		return headersCollection;
	}, [])

	return (
		<>
			{paginateData && (<Stack direction="row" spacing={2} justifyContent="space-between" sx={{ padding: 2 }} alignItems="center">
				{(<GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={globalFilterValue} setGlobalFilter={setGlobalFilterValue} />)}
				{top && (
					<Box sx={{ p: 2 }}>
						<TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageIndex={state.pageIndex} pageSize={state.pageSize} pageCount={pageCount} />
					</Box>
				)}
				<Stack direction="row" alignItems="center" spacing={1}>
					{bulkUploadButton}
					{addButton}
					<HidingSelect hiddenColumns={state.hiddenColumns!} setHiddenColumns={setHiddenColumns} allColumns={allColumns} />
					<CSVExport data={rowSelection ? formatExcelRowsExport(selectedFlatRows, ['row-selection-chk', 'Actions']) : formatExcelRowsExport(selectedFlatRows, ['row-selection-chk', 'Actions'])} headers={exportHeaders} filename={filename ? filename : 'data.csv'} />
				</Stack>
			</Stack>)}

			<ScrollX sx={{ height: 500 }}>
				<TableRowSelection selected={Object.keys(state.selectedRowIds).length} />
				<TableWrapper>
					<Table {...getTableProps()} stickyHeader style={{ display: "flex", flexDirection: "column" }}>
						<TableHead sx={{ borderTopWidth: 2 }} style={{
							position: "sticky",
							top: 0,
							// alignSelf: "flex-start",
							zIndex: 1
						}}>
							{headerGroups.map((headerGroup, index: number) => {
								return (
									<TableRow {...headerGroup.getHeaderGroupProps()} key={index}>
										{headerGroup.headers.map((column: HeaderGroup, i: number) => (
											<TableCell
												{...column.getHeaderProps([{ className: column.className }])}
												sx={{ position: 'sticky !important', '&:hover::after': { bgcolor: 'primary.main', width: 2 }, textTransform: 'none', 'fontSize': '0.9rem' }}
												key={i}
											>
												{column.render("Header")}
												{/* <div>
													{!column.disableSortBy ? (
														<div>
															<Stack direction="row" alignItems="center" justifyContent='center' spacing={1}>
																{column.render("Header")}
																<Stack sx={{ color: 'secondary.light', width: '0px !important', flex: 'inherit !important', marginLeft: '8px' }} {...(true && { ...column.getHeaderProps(column.getSortByToggleProps()) })}>
																	<CaretUpOutlined
																		style={{
																			fontSize: '0.625rem',
																			width: 10,
																			color: column.isSorted && !column.isSortedDesc ? theme.palette.text.secondary : 'inherit'
																		}}
																	/>
																	<CaretDownOutlined
																		style={{
																			fontSize: '0.625rem',
																			marginTop: -2,
																			width: 10,
																			color: column.isSortedDesc ? theme.palette.text.secondary : 'inherit'
																		}}
																	/>
																</Stack>
															</Stack>
														</div>
													) : column.render("Header")}
												</div> */}

											</TableCell>
										))}
									</TableRow>
								)
							})}
						</TableHead>
						<TableBody {...getTableBodyProps()}>
							{/* {headerGroups.map((group: HeaderGroup<{}>, index: number) => (
								<TableRow {...group.getHeaderGroupProps()} key={index}>
									{group.headers.map((column: HeaderGroup, i: number) => (
										column.canFilter ?
											<TableCell
												{...column.getHeaderProps([{ className: column.className }])}
												sx={{ position: 'sticky !important' }}
												key={i}>
												{column.render('Filter')}
											</TableCell> :
											<TableCell {...column.getHeaderProps([{ className: column.className }])} key={i}>
											</TableCell>
									))}
								</TableRow>
							))} */}
							{loadingPage ? (
								Array(state.pageSize).fill('').map((item, index) => (
									<TableRow key={index}>
										{Array(10).fill('').map((cell, index: number) => (
											<TableCell key={index}>
												<Skeleton />
											</TableCell>
										))}
									</TableRow>
								))
							) : rowCount !== 0 ? (
								page.map((row: any, i) => {
									prepareRow(row);
									return (
										<TableRow
											{...row.getRowProps()}
											key={row.original.id}
											onClick={() => {
												row.toggleRowSelected();
											}}
											sx={{ cursor: 'pointer', bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit' }}
										>
											{row.cells.map((cell: Cell, index: number) => (
												<TableCell {...cell.getCellProps([{ className: cell.column.className }])} key={index} sx={{ overflowWrap: 'break-word' }}>
													{cell.render('Cell')}
												</TableCell>
											))}
										</TableRow>
									);
								})
							) : null}
						</TableBody>
					</Table>
				</TableWrapper>
			</ScrollX>
			<Box>
				{!top && paginateData && (
					<Box sx={{ p: 2 }}>
						<TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageIndex={state.pageIndex} pageSize={state.pageSize} pageCount={pageCount} />
					</Box>
				)}
			</Box>
		</>
	);
}


export default CustomTable;