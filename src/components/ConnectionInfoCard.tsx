import Card from './Card';
import CardRow from './CardRow';
import CardTitle from './CardTitle';
import { FC, useMemo } from 'react';
import useMoneroStore from '../stores/monero';

interface ConnectionInfoCardProps {}

const ConnectionInfoCard: FC<ConnectionInfoCardProps> = ({}) => {
  const infoData = useMoneroStore((state) => state.info.data);
  const connectionsData = useMoneroStore((state) => state.connections.data);

  const infoResult = infoData && 'result' in infoData ? infoData.result : null;
  const connectionsResult = connectionsData && 'result' in connectionsData ? connectionsData.result : null;

  const { ipv4Count, ipv6Count } = useMemo(() => {
    let ipv4 = 0;
    let ipv6 = 0;

    const connectionList = connectionsResult?.connections;
    if (Array.isArray(connectionList)) {
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
  }, [connectionsResult]);

  return (
    <div>
      <CardTitle>Connection info</CardTitle>
      <Card>
        <CardRow label="Incoming">
          {infoResult?.restricted ? (
            <span className="text-slate-300 dark:text-slate-500">Restricted</span>
          ) : (
            infoResult?.incoming_connections_count ?? '---'
          )}
        </CardRow>
        <CardRow label="Outgoing">
          {infoResult?.restricted ? (
            <span className="text-slate-300 dark:text-slate-500">Restricted</span>
          ) : (
            infoResult?.outgoing_connections_count ?? '---'
          )}
        </CardRow>
        <CardRow label="RPC">
          {infoResult?.restricted ? (
            <span className="text-slate-300 dark:text-slate-500">Restricted</span>
          ) : (
            infoResult?.rpc_connections_count ?? '---'
          )}
        </CardRow>
        <CardRow label="IPv4 Connections">
          {connectionsResult?.connections ? ipv4Count : '---'}
        </CardRow>
        <CardRow label="IPv6 Connections">
          {connectionsResult?.connections ? ipv6Count : '---'}
        </CardRow>
      </Card>
    </div>
  );
};

export default ConnectionInfoCard;