import IndexedDB from '@/utils/IndexedDB';
const airbnbDB = new IndexedDB('airbnb');
// mock接口
export async function fetchElephant() {
    await airbnbDB.openStore({ elephant: { keyPath: 'id', index: ['nose', 'ear'] } });
    const result = await airbnbDB.getList('elephant').then((res: any) => {
        return {
            code: '000000',
            message: '操作成功',
            result: res,
            success: true
        };
    });
    return result;
}