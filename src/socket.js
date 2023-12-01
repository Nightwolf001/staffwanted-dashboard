import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3333';
console.log('URL', URL);
export const socket = io(URL);