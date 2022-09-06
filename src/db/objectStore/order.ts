// 引入类型别名
import TypeObjectStore from '../type';

const webOrder: TypeObjectStore = {
    keyPath: 'orderId',
    index: ['title', 'personNumber', 'pictureUrl', 'price']
}

const orderObjectStore = {
    web_order: webOrder,
}

export default orderObjectStore