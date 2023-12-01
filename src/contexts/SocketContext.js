import PropTypes from 'prop-types';
import React, { createContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../redux/store';

import { socket } from '../socket';

const SocketContext = createContext();

SocketProvider.propTypes = {
    children: PropTypes.node,
};


function SocketProvider({ children }) {

  const { user } = useSelector((state) => state.user);

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);
  const [recievedMessage, setRecievedMessage] = useState('');

  console.log('fooEvents', fooEvents);

  useEffect(() => {
    function onConnect() {
      console.log('connected');
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log('connected');
      setIsConnected(false);
    }

    function onFooEvent(value) {
      console.log('onFooEvent', value);
      setRecievedMessage(value);
      setFooEvents(previous => [...previous, value]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on(`message:employer:${user.profile_id}`, onFooEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('new:message:madebycode', onFooEvent);
    };
  }, []);

  const value = {
    isConnected,
    fooEvents,
    recievedMessage
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export { SocketProvider, SocketContext };




