import TypeObjectStore from '../type' // 引入类型别名

const webRecord: TypeObjectStore = {
    keyPath: 'recordId',
    index: ['title', 'personNumber', 'pictureUrl', 'price']
}

const recordObjectStore = {
    web_record: webRecord
}

export default recordObjectStore