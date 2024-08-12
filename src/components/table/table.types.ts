export type TableColDef = {
  field: string;
  headerName: string;
};

export type TableRowDef = {
  id: string;
  [key: string]: string;
};

export type TableProps = {
  columns: TableColDef[];
  rows: TableRowDef[];
};
