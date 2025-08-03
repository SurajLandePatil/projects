package com.vehiclebreakdown.config;

import com.vehiclebreakdown.websocket.NotificationWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Autowired
    private NotificationWebSocketHandler notificationHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(notificationHandler, "/ws/notifications")
                .setAllowedOrigins("*");
    }
}


//
////Replace WebSocketConfig.java
//@Configuration
//@EnableWebSocket
//public class WebSocketConfig implements WebSocketConfigurer {
//
// @Override
// public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
//     registry.addHandler(new NotificationWebSocketHandler(), "/ws/notifications")
//             .setAllowedOrigins("*");
// }
//}
//
////Update NotificationWebSocketHandler.java
//@Component
//public class NotificationWebSocketHandler extends TextWebSocketHandler {
// private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
//
// @Override
// public void afterConnectionEstablished(WebSocketSession session) throws Exception {
//     String userId = extractUserIdFromSession(session);
//     if (userId != null) {
//         sessions.put(userId, session);
//         System.out.println("WebSocket connected for user: " + userId);
//     }
// }
//
// @Override
// public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
//     sessions.values().remove(session);
// }
//
// public void sendNotificationToUser(String userId, Object notification) {
//     WebSocketSession session = sessions.get(userId);
//     if (session != null && session.isOpen()) {
//         try {
//             ObjectMapper mapper = new ObjectMapper();
//             String message = mapper.writeValueAsString(notification);
//             session.sendMessage(new TextMessage(message));
//         } catch (IOException e) {
//             e.printStackTrace();
//         }
//     }
// }
//
// private String extractUserIdFromSession(WebSocketSession session) {
//     // Extract from query parameters: ws://localhost:8080/ws/notifications?userId=123
//     String query = session.getUri().getQuery();
//     if (query != null && query.startsWith("userId=")) {
//         return query.substring(7);
//     }
//     return null;
// }
//}
