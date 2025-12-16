import { io, Socket } from 'socket.io-client';
import { APP_CONFIG } from '../configs';

// Get base URL without /api suffix for WebSocket
const getWebSocketURL = (): string => {
  const apiUrl = APP_CONFIG.api.baseURL;
  // Remove /api suffix if present
  return apiUrl.replace(/\/api$/, '');
};

// Get token from cookies (if not HTTP-only)
// Note: If cookies are HTTP-only, this will return null, but Socket.IO will still send cookies automatically with withCredentials: true
const getToken = (): string | null => {
  try {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'token') {
        return decodeURIComponent(value);
      }
    }
  } catch (error) {
    // Cookies might be HTTP-only, which is fine - Socket.IO will send them automatically
  }
  return null;
};

// WebSocket service
class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second

  /**
   * Connect to WebSocket server
   */
  connect(): void {
    if (this.socket?.connected) {
      console.log('WebSocket already connected');
      return;
    }

    const token = getToken();
    const wsUrl = getWebSocketURL();
    console.log(`Connecting to WebSocket server: ${wsUrl}`);

    // Socket.IO config
    const socketConfig: any = {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      withCredentials: true, // Enable cookies (this will send HTTP-only cookies automatically)
    };

    // If we can read the token from cookies, send it via auth as well
    // Otherwise, rely on cookies being sent automatically
    if (token) {
      socketConfig.auth = { token };
    }

    this.socket = io(wsUrl, socketConfig);

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('❌ WebSocket disconnected:', reason);
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('WebSocket disconnected');
    }
  }

  /**
   * Join a conversation room
   * @param conversationId - Conversation ID to join
   */
  joinConversation(conversationId: string): void {
    if (this.socket?.connected && conversationId) {
      this.socket.emit('join_conversation', conversationId);
      console.log(`Joined conversation room: ${conversationId}`);
    }
  }

  /**
   * Leave a conversation room
   * @param conversationId - Conversation ID to leave
   */
  leaveConversation(conversationId: string): void {
    if (this.socket?.connected && conversationId) {
      this.socket.emit('leave_conversation', conversationId);
      console.log(`Left conversation room: ${conversationId}`);
    }
  }

  /**
   * Listen for new messages
   * @param callback - Callback function to handle new messages
   * @returns Function to unsubscribe
   */
  onNewMessage(callback: (message: any) => void): () => void {
    if (!this.socket) {
      console.warn('WebSocket not connected, cannot listen for messages');
      return () => {};
    }

    this.socket.on('new_message', callback);

    // Return unsubscribe function
    return () => {
      if (this.socket) {
        this.socket.off('new_message', callback);
      }
    };
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Export singleton instance
export const websocketService = new WebSocketService();

