import { ErrorResponce, GetConnectionsResponse, GetInfoResponse, ResultResponce, GetNetStatsResponse } from '../types/monero';

export class MoneroApi {
  private _send = (method: string): Promise<Response> => {
    return fetch(`/json_rpc`, { 
      method: 'POST', 
      body: JSON.stringify({ jsonrpc: '2.0', id: '0', method }) 
    });
  };

  public getInfo = async (): Promise<ResultResponce<GetInfoResponse> | ErrorResponce> => {
    const res = await this._send('get_info');
    return res.ok ? res.json() : Promise.reject();
  };

  public getConnections = async (): Promise<ResultResponce<GetConnectionsResponse> | ErrorResponce> => {
    const res = await this._send('get_connections');
    return res.ok ? res.json() : Promise.reject();
  };

  public getNetStats = async (): Promise<GetNetStatsResponse | ErrorResponce> => {
    const res = await fetch(`/get_net_stats`, { method: 'GET' });
    return res.ok ? res.json() : Promise.reject();
  };
}