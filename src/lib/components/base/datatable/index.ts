export { default as DataCell } from './DataCell.svelte';
export { default as DataRow } from './DataRow.svelte';
export { default as DataTable } from './DataTable.svelte';
export { default as FooterCell } from './FooterCell.svelte';
export { default as FooterRow } from './FooterRow.svelte';
export { default as HeaderCell } from './HeaderCell.svelte';
export { default as HeaderRow } from './HeaderRow.svelte';

export type { Column, Footer } from './types';

export { default as ActionButton } from './ActionButton.svelte';

/* import Table from './DataTable.svelte';
import HeaderRowX from './HeaderRow.svelte';
import DataRowX from './DataRow.svelte';
import FooterRowX from './FooterRow.svelte';
import HeaderCell from './HeaderCell.svelte';
import DataCell from './DataCell.svelte';
import FooterCell from './FooterCell.svelte';

const HeaderRow = Object.assign(HeaderRowX, { Cell: HeaderCell });
const DataRow = Object.assign(DataRowX, { Cell: DataCell });
const FooterRow = Object.assign(FooterRowX, { Cell: FooterCell });

export default Object.assign(Table, { HeaderRow, DataRow, FooterRow }); */
