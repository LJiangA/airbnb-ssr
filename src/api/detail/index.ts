import http from '@/utils/http';
import { IResultOr, IRoomDetailParams } from '../interface';
// 真实接口 ———— 房屋详情页接口
export function fetchRoomDetail(params: IRoomDetailParams): Promise<IResultOr> {
    return http.httpRequestGet('/api/room/room/getRoomDetail', params);
}