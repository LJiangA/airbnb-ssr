export default class DB {
    // 数据库名称
    private dbName: string;
    // IDBDatabase对象，它表示连接的数据库。后面对数据库的操作，都通过这个对象完成。
    private db: any;
    // IDBTransaction 对象用来异步操作数据库事务，所有的读写操作都要通过这个对象进行
    // IDBDatabase.transaction()方法返回的就是一个 IDBTransaction 对象

    constructor(dbName: string) {
        this.dbName = dbName;
    }

    // 打开数据库(storeName仓库名, keyPath数据库主键, index索引数组)
    public openStore(stores: any) {
        // 打开数据库(传入两个参数:数据库名和版本号),会立刻返回一个 IDBOpenDBRequest 对象,该对象有三个方法
        const openRequest = window.indexedDB.open(this.dbName, 4);
        console.log('openRequest对象', openRequest);
        return new Promise((resolve, reject) => {
            // 打开成功的回调
            openRequest.onsuccess = (event: any) => {
                // 打开数据库成功后，拿到已经打开的IndexedDB数据库对象
                this.db = event.target.result;
                // this.db = openRequest.result; // 这样也能拿到IndexedDB数据库对象
                // console.log(this.db, openRequest.result);
                console.log('数据库打开成功');
                resolve(true);
            };
            // 打开失败的回调
            openRequest.onerror = (event: any) => {
                console.log('数据库打开失败');
                reject(event);
            };
            // 第一次打开数据库时，会先触发upgradeneeded事件，然后触发success事件
            // 数据库升级(初始化)的回调,这个会在打开成功之前调用
            openRequest.onupgradeneeded = (event: any) => {
                console.log('数据库升级成功', event);
                // const IDBDatabase = openRequest.result;
                // console.log(IDBDatabase);
                // 打开数据成功以后，可以从IDBOpenDBRequest对象的result属性上面，
                // 拿到一个IDBDatabase对象, 它表示连接的数据库。
                // 后面对数据库的操作，都通过这个对象完成。
                const { result } :any = event.target; // 解构解析拿到IDBDatabase对象
                console.log('IDBDatabase对象', result, stores);
                // 创建对象仓库, 初始化多个objectStore对象仓库
                for (const storeName in stores) {
                    console.log('对象仓库', storeName);
                    const { keyPath, index } = stores[storeName]
                    // createObjectStore会返回一个对象仓库objectStore(即新建一个表)
                    // 该方法接受第二个对象参数，用来设置对象仓库的属性keyPath: 主键(key);  autoIncrement: 是否自增;
                    const store = result.createObjectStore(storeName, { autoIncrement: true, keyPath });
                    console.log('返回的objectStore对象', store);
                    // 为对象仓库的各个属性建立索引
                    if (index && index.length > 0) {
                        index.forEach((v:string) => {
                            console.log('@', v);
                            // createIndex可以新建索引, unique字段表示是否唯一
                            store.createIndex(v, v, { unique: false });
                        });
                    }
                    // store.transaction 返回当前对象仓库所属的事务对象IDBTransaction，用来异步操作数据库事务
                    // IDBTransaction.oncomplete 指定complete事件（事务成功）的监听函数
                    // store.transaction.oncomplete = (event: any) => {
                    //     console.log(`创建对象仓库${storeName}成功`, event);
                    // };
                }
            };
        });
    }

    // 新增/修改数据
    updateItem(storeName: string, data: any) {
        // param1:表名 param2:要传入的数据
        // 返回指定名称的对象仓库 IDBObjectStore
        const store = this.db.transaction([storeName], 'readwrite').objectStore(storeName);
        // IDBObjectStore.put()方法用于更新某个主键对应的数据记录，如果对应的键值不存在，则插入一条新的记录
        const request = store.put({
            ...data,
            updateTime: new Date().getTime() // 给对象添加一个时间戳属性，放置因为值相同而插入失败
        });
        console.log(request);
        return new Promise((resolve, reject) => {
            request.onsuccess = (event: any) => {
                console.log(`更新对象仓库${storeName}中的数据成功`, event.target);
                resolve(event);
            };

            request.onerror = (event: any) => {
                console.log(`更新对象仓库${storeName}中的数据失败`, event.target);
                reject(event);
            };
        });
    }

    // 删除数据
    deleteItem(storeName: string, key: number | string) {
        // param1:表名 param2:要传入的数据
        const IDBTransaction = this.db.transaction([storeName], 'readwrite')
        // 返回指定名称的对象仓库 IDBObjectStore
        const store = IDBTransaction.objectStore(storeName);
        // IDBObjectStore.delete()方法用于删除指定主键的记录。该方法返回一个 IDBRequest 对象
        const request = store.delete(key);
        return new Promise((resolve, reject) => {
            request.onsuccess = (event: any) => {
                console.log(`删除对象仓库${storeName}中key=${key}的数据成功`, event);
                resolve(event);
            };

            request.onerror = (event: any) => {
                console.log(`删除对象仓库${storeName}中key=${key}的数据失败`, event);
                reject(event);
            };
        });
    }

    // 查询所有数据
    getList(storeName: string) {
        // param1:表名 param2:要传入的数据
        // 返回指定名称的对象仓库 IDBObjectStore
        const store = this.db.transaction(storeName).objectStore(storeName);
        // DBObjectStore.getAll()用于获取对象仓库的记录。该方法返回一个 IDBRequest 对象
        const request = store.getAll();
        return new Promise((resolve, reject) => {
            request.onsuccess = (event: any) => {
                console.log(`查询对象仓库${storeName}中的所有数据成功`, event.target.result);
                resolve(event.target.result);
            };

            request.onerror = (event: any) => {
                console.log(`查询对象仓库${storeName}中的所有数据失败`, event);
                reject(event);
            };
        });
    }

    // 查询单条数据
    getItem(storeName: string, key: number | string) {
        // param1:表名 param2:要传入的数据
        // 返回指定名称的对象仓库 IDBObjectStore
        const store = this.db.transaction(storeName).objectStore(storeName);
        // IDBObjectStore.get()用于获取主键对应的数据记录。该方法返回一个 IDBRequest 对象
        const request = store.get(key);
        return new Promise((resolve, reject) => {
            // 这里只调用成功的回调
            request.onsuccess = (event: any) => {
                console.log(`查询对象仓库${storeName}中key=${key}的数据成功`, event.target);
                resolve(event.target.result);
            };
            // 当没有查询到数据时, 这个失败的回调不会执行,why?
            request.onerror = (event: any) => {
                console.log(`查询对象仓库${storeName}中key=${key}的数据失败`, event.target);
                reject(event);
            };
        });
    }
}