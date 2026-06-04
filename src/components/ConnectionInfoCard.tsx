import Card from './Card';
import CardRow from './CardRow';
import CardTitle from './CardTitle';
import { FC, useMemo } from 'react';
import useMoneroStore from '../stores/monero';

interface ConnectionInfoCardProps {}

const ConnectionInfoCard: FC<ConnectionInfoCardProps> = ({}) => {
  const info = useMoneroStore((state) => state.info.data) as any;
  const connections = useMoneroStore((state) => state.connections.data) as any;

  const { ipv4Count, ipv6Count } = useMemo(() => {
    let ipv4 = 0;
    let ipv6 = 0;

    const connectionList = connections?.result?.connections;
    if (connectionList && Array.isArray(connectionList)) {
      connectionList.forEach((conn: any) => {
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

  return (
    <div>
      <CardTitle>Connection info</CardTitle>
      <Card>
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
        <CardRow label="RPC">
          {info?.result?.restricted ? (
            <span className="text-slate-300 dark:text-slate-500">Restricted</span>
          ) : (
            info?.result?.rpc_connections_count ?? '---'
          )}
        </CardRow>
        <CardRow label="IPv4 Connections">
          {connections?.result?.connections ? ipv4Count : '---'}
        </CardRow>
        <CardRow label="IPv6 Connections">
          {connections?.result?.connections ? ipv6Count : '---'}
        </CardRow>
      </Card>
    </div>
  );
};

export default ConnectionInfoCard;