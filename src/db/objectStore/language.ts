// 引入类型别名
import TypeObjectStore from '../type';

const webLang: TypeObjectStore = {
    keyPath: 'id',
    index: ['name'],
}

const langObjectStore = {
    language: webLang,
}

export default langObjectStore;