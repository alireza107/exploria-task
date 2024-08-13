import { Table } from '@/components/table';
import { TableColDef } from '@/components/table/table.types';
import { DATA } from '@/data/records';

const tableCols: TableColDef[] = [
  { field: 'id', headerName: 'User ID' },
  {
    field: 'name',
    headerName: 'Name of the User',
  },
  {
    field: 'date',
    headerName: 'Date of Registration',
  },
  {
    field: 'address',
    headerName: 'Address',
  },
  {
    field: 'phone',
    headerName: 'Phone Number',
  },
];

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <Table columns={tableCols} rows={DATA} />
    </main>
  );
}
