import { Table } from '@/components/table';
import { TableColDef } from '@/components/table/table.types';
import { DATA } from '@/data/records';

const tableCols: TableColDef[] = [
  { field: 'id', headerName: 'id' },
  {
    field: 'name',
    headerName: 'name',
  },
  {
    field: 'date',
    headerName: 'registered date',
  },
  {
    field: 'address',
    headerName: 'address',
  },
  {
    field: 'phone',
    headerName: 'phone',
  },
];

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <Table columns={tableCols} rows={DATA} />
    </main>
  );
}
