import { useState, useEffect, useRef } from 'react';

const useWebSocket = (url) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!url) return;

    socketRef.current = new WebSocket(url);

    socketRef.current.onopen = () => {
      console.log('WebSocket connected');
    };

    socketRef.current.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setData(JSON.parse(event.data));
      // console.log('WebSocket message received:', newData);
    };

    socketRef.current.onerror = (event) => {
      console.error('WebSocket error', event);
      setError(new Error('WebSocket error'));
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [url]);

  const closeSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
      console.log('WebSocket manually closed');
    }
  };

  return { data, error, closeSocket };
};

export default useWebSocket;
