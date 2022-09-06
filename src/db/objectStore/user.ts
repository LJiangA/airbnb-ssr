import TypeObjectStore from '../type';

const webUser: TypeObjectStore = {
    keyPath: 'userId',
    index: ['phone', 'password', 'status'],
}

const userObjectStore = {
    web_user: webUser,
}

export default userObjectStore;