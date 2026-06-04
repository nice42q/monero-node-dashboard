import Card from './Card';
import CardRow from './CardRow';
import CardTitle from './CardTitle';
import type { FC } from 'react';
import useMoneroStore from '../stores/monero';

interface MoneroInfoCardProps {}

const formatNumber = (num: number | undefined): string => {
  if (num === undefined || num === null) return '---';
  return new Intl.NumberFormat().format(num);
};

const MoneroInfoCard: FC<MoneroInfoCardProps> = () => {
  const { data: info } = useMoneroStore((state) => state.info);

  // Hashrate: Difficulty / 120s Blocktime -> GH/s
  const hashrate = info?.result?.difficulty 
    ? `${(info.result.difficulty / 120 / 1000000000).toFixed(2)} GH/s` 
    : '---';

  return (
    <div>
      <CardTitle>Monero info</CardTitle>
      <Card>
        <CardRow label="Difficulty">{formatNumber(info?.result?.difficulty)}</CardRow>
        <CardRow label="Height">{formatNumber(info?.result?.height)}</CardRow>
        <CardRow label="Target Height">{formatNumber(info?.result?.target_height)}</CardRow>
        <CardRow label="Network Hashrate">{hashrate}</CardRow>
        <CardRow label="Unconfirmed TXs">{info?.result?.tx_pool_size !== undefined ? `${info.result.tx_pool_size}` : '---'}</CardRow>
      </Card>
    </div>
  );
};
export default MoneroInfoCard;