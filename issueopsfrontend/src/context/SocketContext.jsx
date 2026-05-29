import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    const s = io(SOCKET_URL, {
      auth: { token },
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
    });

    s.on('connect', () => setConnected(true));
    s.on('disconnect', () => setConnected(false));

    // Uncomment when backend is ready
    // s.connect();

    setSocket(s);
    return () => { s.disconnect(); };
  }, [token]);

  const joinRoom = (room) => socket?.emit('join:room', room);
  const leaveRoom = (room) => socket?.emit('leave:room', room);

  return (
    <SocketContext.Provider value={{ socket, connected, joinRoom, leaveRoom }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
