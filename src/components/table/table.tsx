import { TableProps } from './table.types';
import './table.css';

export const Table: React.FC<TableProps> = ({ columns, rows }: TableProps) => {
  return (
    <table className='e-table'>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.field}>{col.headerName}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={row.id} className={i % 2 ? 'row-even' : 'row-odd'}>
            {columns.map((col) => (
              <td key={col.field + row.id}>{row[col.field]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
