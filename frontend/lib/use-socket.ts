import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Determine backend URL based on environment
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    
    // Initialize socket connection
    const socketInstance = io(backendUrl, {
      path: '/socket.io',
      transports: ['websocket'],
      autoConnect: true,
    });

    socketInstance.on('connect', () => {
      setSocket(socketInstance);
    });

    socketInstance.on('disconnect', () => {
      setSocket(null);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);


  return socket;
};
