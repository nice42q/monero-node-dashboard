// @ts-nocheck
import Card from './Card';
import CardRow from './CardRow';
import CardTitle from './CardTitle';
import { FC, useMemo } from 'react';
import useMoneroStore from '../stores/monero';

interface ConnectionInfoCardProps {}

const ConnectionInfoCard: FC<ConnectionInfoCardProps> = ({}) => {
  const info = useMoneroStore((state) => state.info?.data);
  const connections = useMoneroStore((state) => state.connections?.data);

  const { ipv4Count, ipv6Count } = useMemo(() => {
    let ipv4 = 0;
    let ipv6 = 0;

    const connectionList = connections?.result?.connections;
    if (connectionList && Array.isArray(connectionList)) {
      connectionList.forEach((conn) => {
        const addr = conn?.address; 
        
        if (addr && (addr.includes('::ffff:') || addr.startsWith('['))) {
          ipv6++;
        } else {
          ipv4++;
        }
      });
    }

    return { ipv4Count: ipv4, ipv6Count: ipv6 };
  }, [connections]);

  const formatBytes = (bytes: number | undefined): string => {
    if (bytes === undefined || bytes === null || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      <CardTitle>Connection info</CardTitle>
      <Card>
        <CardRow label="RPC">
          {info?.result?.restricted ? (
            <span className="text-slate-300 dark:text-slate-500">Restricted</span>
          ) : (
            info?.result?.rpc_connections_count ?? '---'
          )}
        </CardRow>
        <CardRow label="Incoming">
          {info?.result?.restricted ? (
            <span className="text-slate-300 dark:text-slate-500">Restricted</span>
          ) : (
            info?.result?.incoming_connections_count ?? '---'
          )}
        </CardRow>
        <CardRow label="Outgoing">
          {info?.result?.restricted ? (
            <span className="text-slate-300 dark:text-slate-500">Restricted</span>
          ) : (
            info?.result?.outgoing_connections_count ?? '---'
          )}
        </CardRow>
        <CardRow label="IPv4 Connections">
          {connections?.result?.connections ? ipv4Count : '---'}
        </CardRow>
        <CardRow label="IPv6 Connections">
          {connections?.result?.connections ? ipv6Count : '---'}
        </CardRow>
        <CardRow label="Data Downloaded">{formatBytes(info?.result?.total_bytes_downloaded)}</CardRow>
        <CardRow label="Data Uploaded">{formatBytes(info?.result?.total_bytes_uploaded)}</CardRow>
      </Card>
    </div>
  );
};

export default ConnectionInfoCard;