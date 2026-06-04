import Card from './Card';
import CardRow from './CardRow';
import CardTitle from './CardTitle';
import type { FC } from 'react';
import { formatBytes } from '../utils';
import useMoneroStore from '../stores/monero';

interface ServerInfoCardProps {}

const getUptimeString = (startTime: number) => {
  if (!startTime) return '---';
  const seconds = Math.floor(Date.now() / 1000) - startTime;
  if (seconds < 0) return '---';
  
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  return d > 0 ? `${d}d ${h}h` : `${h}h ${m}m`;
};

const ServerInfoCard: FC<ServerInfoCardProps> = ({}) => {
  const { data: info } = useMoneroStore((state) => state.info);

  return (
    <div>
      <CardTitle>Server info</CardTitle>
      <Card>
        <CardRow label="Version">{info?.result?.restricted ? <span className="text-slate-300 dark:text-slate-500">Restricted</span> : info?.result?.version}</CardRow>
        <CardRow label="Net-type">{info?.result?.nettype}</CardRow>
        <CardRow label="Update Available">{info?.result?.restricted ? <span className="text-slate-300 dark:text-slate-500">Restricted</span> : info?.result?.update_available ? 'Yes' : 'No'}</CardRow>
        
        <CardRow label="Status">
          {info?.result?.restricted ? (
            <span className="text-slate-300 dark:text-slate-500">Restricted</span>
          ) : info?.result?.busy_syncing ? (
            <span className="text-amber-500 font-medium dark:text-amber-400">Syncing...</span>
          ) : (
            <span className="text-emerald-500 font-medium dark:text-emerald-400">Fully Synced</span>
          )}
        </CardRow>

        <CardRow label="Blockchain">
          {info?.result?.restricted ? (
            <span className="text-slate-300 dark:text-slate-500">Restricted</span>
          ) : info?.result?.pruning_seed ? (
            <span className="text-blue-500 font-medium dark:text-blue-400">Pruned</span>
          ) : (
            'Full'
          )}
        </CardRow>
        
        <CardRow label="Database Size">{formatBytes(info?.result?.database_size ?? 0)}</CardRow>
        <CardRow label="Free Space">{info?.result?.restricted ? <span className="text-slate-300 dark:text-slate-500">Restricted</span> : formatBytes(info?.result?.free_space ?? 0)}</CardRow>
        <CardRow label="Uptime">{info?.result?.start_time ? getUptimeString(info.result.start_time) : '---'}</CardRow>
      </Card>
    </div>
  );
};
export default ServerInfoCard;