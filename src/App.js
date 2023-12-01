import React, { useState, useEffect } from 'react';
// routes
import Router from './routes';
// import { ConnectionState } from './components/ConnectionState';
// import { ConnectionManager } from './components/ConnectionManager';
import { SocketProvider } from './contexts/SocketContext';

// theme
import ThemeProvider from './theme';
// components
import ThemeSettings from './components/settings';
import { ChartStyle } from './components/chart';
import ScrollToTop from './components/ScrollToTop';
import { ProgressBarStyle } from './components/ProgressBar';
import NotistackProvider from './components/NotistackProvider';
import MotionLazyContainer from './components/animate/MotionLazyContainer';

// ----------------------------------------------------------------------

export default function App() {

  // const [isConnected, setIsConnected] = useState(socket.connected);
  // const [fooEvents, setFooEvents] = useState([]);
  // console.log('fooEvents', fooEvents);
  // useEffect(() => {
  //   function onConnect() {
  //     console.log('connected');
  //     setIsConnected(true);
  //   }

  //   function onDisconnect() {
  //     console.log('connected');
  //     setIsConnected(false);
  //   }

  //   function onFooEvent(value) {
  //     console.log('onFooEvent', value);
  //     setFooEvents(previous => [...previous, value]);
  //   }

  //   socket.on('connect', onConnect);
  //   socket.on('disconnect', onDisconnect);
  //   socket.on('message:employer:1', onFooEvent);

  //   return () => {
  //     socket.off('connect', onConnect);
  //     socket.off('disconnect', onDisconnect);
  //     socket.off('new:message:madebycode', onFooEvent);
  //   };
  // }, []);

  return (
    <SocketProvider>
      <MotionLazyContainer>
        <ThemeProvider>
          <ThemeSettings>
            <NotistackProvider>
              <ProgressBarStyle />
              <ChartStyle />
              <ScrollToTop />
              <Router />
            </NotistackProvider>
          </ThemeSettings>
        </ThemeProvider>
      </MotionLazyContainer>
    </SocketProvider>
  );
}
