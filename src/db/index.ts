import IndexedDB from '../utils/indexedDB'; // 引入indexedDB工具类
import langObjectStore from './objectStore/language'; // 引入语言类型对象仓库
import userObjectStore from './objectStore/user'; // 引入用户信息对象仓库
import orderObjectStore from './objectStore/order'; // 引入订单记录对象仓库
import recordObjectStore from './objectStore/record'; // 引入浏览记录对象仓库

// 数据库
const airbnbDB = new IndexedDB('airbnbDB');

export default {
    airbnbDB, // 数据库
    // 数据库的对象仓库
    langObjectStore,
    userObjectStore,
    orderObjectStore,
    recordObjectStore
}