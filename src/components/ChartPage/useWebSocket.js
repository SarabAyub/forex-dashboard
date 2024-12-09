import { useEffect } from 'react';

const useWebSocket = (websocketUrl, onMessage, onError , qoutes) => {
    useEffect(() => {
        let socket;
      
        const connect = () => {
          socket = new WebSocket(websocketUrl);
      
          socket.onopen = () => {
            console.log('WebSocket connection established.');
            onError(null);
          };
      
          socket.onmessage = onMessage;
      
          socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            onError('WebSocket connection failed.');
            setTimeout(connect, 5000);
          };
      
          socket.onclose = () => {
            console.log('WebSocket connection closed.');
          };
        };
      
        if (websocketUrl) connect();
      
        return () => {
          if (socket) socket.close();
        };
      }, [websocketUrl,qoutes]);
      
};

export default useWebSocket;
