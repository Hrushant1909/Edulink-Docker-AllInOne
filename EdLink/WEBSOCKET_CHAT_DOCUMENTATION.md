# WebSocket Chat Implementation Documentation

## Overview

The chat module has been upgraded to use **WebSocket** for real-time, bidirectional communication. This provides instant message delivery and presence updates without polling.

## Architecture

### Technologies Used

1. **Spring WebSocket** - WebSocket support
2. **STOMP Protocol** - Messaging protocol over WebSocket
3. **JWT Authentication** - Secure WebSocket connections
4. **SimpMessagingTemplate** - Message broadcasting

### Key Components

1. **WebSocketConfig** - Configures WebSocket endpoints and JWT authentication
2. **WebSocketChatController** - Handles real-time message routing
3. **ChatService** - Business logic with WebSocket support
4. **REST Endpoints** - Still available for initial loading and fallback

---

## WebSocket Endpoints

### Connection Endpoint

```
WebSocket URL: ws://localhost:8080/ws
SockJS URL (fallback): http://localhost:8080/ws (with SockJS)
```

### Message Destinations (Client → Server)

| Destination | Purpose | Payload |
|-------------|---------|---------|
| `/app/chat.send` | Send a chat message | `{ subjectId: number, content: string }` |
| `/app/presence.update` | Update user presence | `{ subjectId: number }` |

### Subscription Topics (Server → Client)

| Topic | Purpose | Payload |
|-------|---------|---------|
| `/topic/chat.{subjectId}` | Receive messages for a subject | `ChatMessageDto` |
| `/topic/presence.{subjectId}` | Receive presence updates | `PresenceUpdateDto` |

---

## Frontend Integration Guide

### 1. Connect to WebSocket

#### Using SockJS and STOMP (Recommended)

```javascript
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

// WebSocket connection setup
const socket = new SockJS('http://localhost:8080/ws');
const stompClient = new Client({
    webSocketFactory: () => socket,
    connectHeaders: {
        Authorization: `Bearer ${yourJwtToken}` // JWT token for authentication
    },
    onConnect: () => {
        console.log('WebSocket connected!');
        // Subscribe to topics after connection
        subscribeToChat(subjectId);
        subscribeToPresence(subjectId);
    },
    onStompError: (frame) => {
        console.error('STOMP error:', frame);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000
});

// Connect
stompClient.activate();
```

### 2. Subscribe to Chat Messages

```javascript
function subscribeToChat(subjectId) {
    stompClient.subscribe(`/topic/chat.${subjectId}`, (message) => {
        const chatMessage = JSON.parse(message.body);
        
        // chatMessage structure:
        // {
        //   id: number,
        //   subjectId: number,
        //   senderId: number,
        //   senderName: string,
        //   senderRole: string,
        //   content: string,
        //   createdAt: string (ISO format),
        //   own: boolean
        // }
        
        // Add message to your chat UI
        addMessageToUI(chatMessage);
    });
}
```

### 3. Send a Message

```javascript
function sendChatMessage(subjectId, content) {
    if (stompClient.connected) {
        stompClient.publish({
            destination: '/app/chat.send',
            body: JSON.stringify({
                subjectId: subjectId,
                content: content
            })
        });
    } else {
        console.error('WebSocket not connected');
        // Fallback to REST API
        sendMessageViaREST(subjectId, content);
    }
}
```

### 4. Subscribe to Presence Updates

```javascript
function subscribeToPresence(subjectId) {
    stompClient.subscribe(`/topic/presence.${subjectId}`, (message) => {
        const presenceUpdate = JSON.parse(message.body);
        
        // presenceUpdate structure:
        // {
        //   userId: number,
        //   subjectId: number,
        //   userName: string,
        //   role: string,
        //   online: boolean
        // }
        
        // Update user's online status in UI
        updateUserPresence(presenceUpdate);
    });
}
```

### 5. Update Presence (Ping)

```javascript
function updatePresence(subjectId) {
    if (stompClient.connected) {
        // Send presence update every 30 seconds
        stompClient.publish({
            destination: '/app/presence.update',
            body: JSON.stringify({
                subjectId: subjectId
            })
        });
    }
}

// Set up interval for presence updates
setInterval(() => {
    updatePresence(currentSubjectId);
}, 30000); // Every 30 seconds
```

### 6. Disconnect

```javascript
function disconnectWebSocket() {
    if (stompClient.active) {
        stompClient.deactivate();
    }
}

// Call when component unmounts or user logs out
```

---

## Complete React Example

```jsx
import { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

function ChatComponent({ subjectId, authToken }) {
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);
    const stompClientRef = useRef(null);

    useEffect(() => {
        // Initialize WebSocket connection
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${authToken}`
            },
            onConnect: () => {
                console.log('Connected to WebSocket');
                setConnected(true);
                
                // Subscribe to chat messages
                stompClient.subscribe(`/topic/chat.${subjectId}`, (message) => {
                    const newMessage = JSON.parse(message.body);
                    setMessages(prev => [...prev, newMessage]);
                });
                
                // Subscribe to presence updates
                stompClient.subscribe(`/topic/presence.${subjectId}`, (message) => {
                    const presence = JSON.parse(message.body);
                    console.log('Presence update:', presence);
                    // Update UI based on presence
                });
                
                // Send initial presence update
                updatePresence();
            },
            onDisconnect: () => {
                console.log('Disconnected from WebSocket');
                setConnected(false);
            },
            reconnectDelay: 5000
        });
        
        stompClientRef.current = stompClient;
        stompClient.activate();
        
        // Load initial messages via REST API
        loadInitialMessages();
        
        // Set up presence ping interval
        const presenceInterval = setInterval(updatePresence, 30000);
        
        return () => {
            clearInterval(presenceInterval);
            if (stompClient.active) {
                stompClient.deactivate();
            }
        };
    }, [subjectId, authToken]);
    
    const loadInitialMessages = async () => {
        // Use REST API to load initial messages
        const response = await fetch(`/api/chat/subjects/${subjectId}/messages`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        const data = await response.json();
        setMessages(data.data || []);
    };
    
    const updatePresence = () => {
        if (stompClientRef.current?.connected) {
            stompClientRef.current.publish({
                destination: '/app/presence.update',
                body: JSON.stringify({ subjectId })
            });
        }
    };
    
    const sendMessage = (content) => {
        if (stompClientRef.current?.connected) {
            stompClientRef.current.publish({
                destination: '/app/chat.send',
                body: JSON.stringify({
                    subjectId,
                    content
                })
            });
        } else {
            // Fallback to REST API
            fetch(`/api/chat/subjects/${subjectId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ content })
            });
        }
    };
    
    return (
        <div>
            <div>Status: {connected ? 'Connected' : 'Disconnected'}</div>
            {/* Your chat UI */}
        </div>
    );
}
```

---

## REST API Endpoints (Still Available)

These endpoints are kept for:
- Initial message loading
- Fallback scenarios
- Mobile apps preferring REST

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/chat/subjects/{subjectId}/messages?afterId=X` | Load initial messages |
| `POST` | `/api/chat/subjects/{subjectId}/messages` | Send message (fallback) |
| `POST` | `/api/chat/subjects/{subjectId}/presence/ping` | Update presence (fallback) |
| `GET` | `/api/chat/subjects/{subjectId}/participants` | Get participants list |

---

## Data Transfer Objects (DTOs)

### ChatMessageDto
```json
{
  "id": 1,
  "subjectId": 123,
  "senderId": 456,
  "senderName": "John Doe",
  "senderRole": "STUDENT",
  "content": "Hello everyone!",
  "createdAt": "2024-01-15T10:30:00Z",
  "own": false
}
```

### PresenceUpdateDto
```json
{
  "userId": 456,
  "subjectId": 123,
  "userName": "John Doe",
  "role": "STUDENT",
  "online": true
}
```

### WebSocketMessageRequest
```json
{
  "subjectId": 123,
  "content": "Hello everyone!"
}
```

### PresenceUpdateRequest
```json
{
  "subjectId": 123
}
```

---

## Security

- **JWT Authentication**: WebSocket connections require JWT token in the connection headers
- **Subject Access Control**: Users can only access chats for subjects they're enrolled in (students) or teaching (teachers)
- **Authorization**: Validated on every message

---

## Benefits of WebSocket Implementation

1. ✅ **Real-time Communication** - Messages appear instantly
2. ✅ **Efficient** - No polling overhead
3. ✅ **Bidirectional** - Server can push updates
4. ✅ **Scalable** - Uses efficient pub/sub pattern
5. ✅ **Backward Compatible** - REST endpoints still work

---

## Testing

### Using Postman or Similar Tools

1. **WebSocket Connection**: Use WebSocket client to connect to `ws://localhost:8080/ws`
2. **Send Message**: Send STOMP frame to `/app/chat.send`
3. **Subscribe**: Subscribe to `/topic/chat.{subjectId}`

### Example STOMP Frames

```
CONNECT
Authorization:Bearer YOUR_JWT_TOKEN

SUBSCRIBE
destination:/topic/chat.123
id:sub-1

SEND
destination:/app/chat.send
content-type:application/json

{"subjectId":123,"content":"Hello!"}
```

---

## Troubleshooting

### Connection Issues

- **Check JWT Token**: Ensure valid JWT token in connection headers
- **CORS**: Verify CORS configuration in `SecurityConfig.java`
- **WebSocket Path**: Ensure using correct endpoint `/ws`

### Message Not Received

- **Subscription**: Verify subscribed to correct topic `/topic/chat.{subjectId}`
- **Subject ID**: Ensure using correct subjectId
- **Authorization**: Check user has access to the subject

### Presence Not Updating

- **Ping Interval**: Ensure sending presence updates regularly (every 30 seconds)
- **Topic**: Subscribe to `/topic/presence.{subjectId}`
- **Threshold**: Users are "online" if last seen within 60 seconds

---

## Migration Notes

- REST endpoints remain functional
- WebSocket is **recommended** for real-time features
- Use REST for initial message loading
- Use WebSocket for live messaging
- Fallback to REST if WebSocket connection fails

