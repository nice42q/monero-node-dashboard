import { ArrowTopRightOnSquareIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import { FC, useMemo, useState } from 'react';

import { GetConnectionsConnection } from '../types/monero';
import TableBody from './TableBody';
import TableBodyColumn from './TableBodyColumn';
import { formatBytes } from '../utils';
import useMoneroStore from '../stores/monero';

interface ConnectionsTableProps {}

const extractCleanIp = (address: string): string => {
  if (!address) return '';
  
  if (address.includes('::ffff:')) {
    const match = address.match(/::ffff:([0-9.]+)/);
    if (match && match[1]) return match[1];
  }
  
  if (address.startsWith('[')) {
    const match = address.match(/\[(.*?)\]/);
    if (match && match[1]) return match[1];
  }
  
  if (address.includes('.')) {
    return address.split(':')[0];
  }
  
  return address;
};

const ConnectionsTable: FC<ConnectionsTableProps> = () => {
  const { data: connections } = useMoneroStore((state) => state.connections);
  const [sortConfig, setSortConfig] = useState<{ column: keyof GetConnectionsConnection; order: 'asc' | 'desc' }>({ 
    column: 'send_count', 
    order: 'desc' 
  });

  const displayConnections = useMemo(() => {
    if (!connections?.result?.connections) return [];
    
    const items = [...connections.result.connections];
    return items.sort((a, b) => {
      const valA = a[sortConfig.column];
      const valB = b[sortConfig.column];
      
      if (valA === valB) return 0;
      
      if (sortConfig.order === 'desc') {
        return valA > valB ? -1 : 1;
      } else {
        return valA < valB ? -1 : 1;
      }
    });
  }, [connections, sortConfig]);

  const sortConnections = (column: keyof GetConnectionsConnection) => {
    setSortConfig((_sortConfig) => ({ 
      column, 
      order: _sortConfig.column === column ? (_sortConfig.order == 'asc' ? 'desc' : 'asc') : 'desc' 
    }));
  };

  const getOrderIcon = (column: keyof GetConnectionsConnection) => {
    return column == sortConfig.column && (sortConfig.order == 'desc' ? <ChevronDownIcon className="ml-1 inline w-4" /> : <ChevronUpIcon className="ml-1 inline w-4" />);
  };

  return (
    <table className="min-w-full divide-y divide-slate-300 dark:divide-slate-500">
      <thead className="bg-slate-50 dark:bg-gray-900">
        <tr>
          <th className="select-none py-3.5 px-4 pl-6 text-left text-sm font-medium text-slate-700 hover:cursor-pointer dark:text-white" onClick={() => sortConnections('ip')}>
            Address
            {getOrderIcon('ip')}
          </th>
          <th className="hidden select-none py-3.5 px-4 text-left text-sm font-medium text-slate-700 hover:cursor-pointer dark:text-white sm:table-cell" onClick={() => sortConnections('incoming')}>
            Direction
            {getOrderIcon('incoming')}
          </th>
          <th className="hidden select-none py-3.5 px-4 text-left text-sm font-medium text-slate-700 hover:cursor-pointer dark:text-white md:table-cell" onClick={() => sortConnections('current_upload')}>
            Upload
            {getOrderIcon('current_upload')}
          </th>
          <th className="hidden select-none py-3.5 px-4 text-left text-sm font-medium text-slate-700 hover:cursor-pointer dark:text-white md:table-cell" onClick={() => sortConnections('current_download')}>
            Download
            {getOrderIcon('current_download')}
          </th>
          <th className="hidden select-none py-3.5 px-4 text-left text-sm font-medium text-slate-700 hover:cursor-pointer dark:text-white md:table-cell" onClick={() => sortConnections('send_count')}>
            Sent
            {getOrderIcon('send_count')}
          </th>
          <th className="hidden select-none py-3.5 px-4 text-left text-sm font-medium text-slate-700 hover:cursor-pointer dark:text-white md:table-cell" onClick={() => sortConnections('recv_count')}>
            Received
            {getOrderIcon('recv_count')}
          </th>
        </tr>
      </thead>
      <TableBody>
        {displayConnections.map((connection) => {
          const cleanIp = extractCleanIp(connection.address);
          
          return (
            <tr key={connection.address}>
              <td className="py-3.5 px-4 pl-6 text-sm font-medium text-primary">
                <a 
                  className="relative hover:underline inline-flex items-center gap-1 pr-4" 
                  href={`https://bgp.he.net/ip/${cleanIp}`} 
                  target="_blank" 
                  rel="noreferrer"
                >
                  {connection.address}
                  <ArrowTopRightOnSquareIcon className="w-3 h-3 text-slate-400" />
                </a>
              </td>
              <TableBodyColumn>{connection.incoming ? 'Inbound' : 'Outbound'}</TableBodyColumn>
              <TableBodyColumn>{formatBytes(connection.current_upload)}/s</TableBodyColumn>
              <TableBodyColumn>{formatBytes(connection.current_download)}/s</TableBodyColumn>
              <TableBodyColumn>{formatBytes(connection.send_count)}</TableBodyColumn>
              <TableBodyColumn>{formatBytes(connection.recv_count)}</TableBodyColumn>
            </tr>
          );
        })}
      </TableBody>
    </table>
  );
};
export default ConnectionsTable;