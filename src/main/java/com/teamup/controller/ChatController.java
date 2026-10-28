package com.teamup.controller;

import com.teamup.dto.request.SendMessageRequest;
import com.teamup.dto.response.ChatMessageResponse;
import com.teamup.dto.response.ConversationResponse;
import com.teamup.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/conversations")
    public List<ConversationResponse> getConversations() {
        return chatService.getConversations();
    }

    @PostMapping("/conversations/with/{userId}")
    public ConversationResponse openConversation(@PathVariable Long userId) {
        return chatService.openConversation(userId);
    }

    @GetMapping("/conversations/{id}/messages")
    public List<ChatMessageResponse> getMessages(@PathVariable Long id) {
        return chatService.getMessages(id);
    }

    @PostMapping("/conversations/{id}/messages")
    @ResponseStatus(HttpStatus.CREATED)
    public ChatMessageResponse sendMessage(@PathVariable Long id, @Valid @RequestBody SendMessageRequest request) {
        return chatService.sendMessage(id, request);
    }

    @PostMapping("/conversations/{id}/read")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void markRead(@PathVariable Long id) {
        chatService.markRead(id);
    }

    @GetMapping("/unread-count")
    public long getUnreadCount() {
        return chatService.getUnreadCount();
    }
}