import http from '@/utils/http';
import { IResultOr, IRoomListParams } from '../interface';
// 真实接口 ———— 首页房屋列表接口
export function fetchRoomList(params: IRoomListParams): Promise<IResultOr> {
    return http.httpRequestGet('/api/room/room/getRoomList', params);
}