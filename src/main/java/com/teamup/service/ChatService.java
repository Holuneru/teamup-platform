package com.teamup.service;

import com.teamup.dto.request.SendMessageRequest;
import com.teamup.dto.response.ChatMessageResponse;
import com.teamup.dto.response.ConversationResponse;
import com.teamup.dto.response.UserShortResponse;
import com.teamup.entity.ChatMessage;
import com.teamup.entity.Conversation;
import com.teamup.entity.User;
import com.teamup.enums.NotificationType;
import com.teamup.exception.ResourceNotFoundException;
import com.teamup.repository.ChatMessageRepository;
import com.teamup.repository.ConversationRepository;
import com.teamup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository messageRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public List<ConversationResponse> getConversations() {
        Long userId = currentUserId();
        return conversationRepository.findByParticipantOneIdOrParticipantTwoIdOrderByLastMessageAtDesc(userId, userId)
                .stream()
                .filter(conversation -> !isDeletedFor(conversation, userId))
                .map(conversation -> toConversationResponse(conversation, userId)).toList();
    }

    @Transactional
    public void deleteConversation(Long conversationId) {
        Conversation conversation = getAccessibleConversation(conversationId);
        Long userId = currentUserId();
        if (conversation.getParticipantOneId().equals(userId)) {
            conversation.setParticipantOneDeletedAt(LocalDateTime.now());
        } else {
            conversation.setParticipantTwoDeletedAt(LocalDateTime.now());
        }
        conversationRepository.save(conversation);
    }

    private boolean isDeletedFor(Conversation conversation, Long userId) {
        return conversation.getParticipantOneId().equals(userId)
                ? conversation.getParticipantOneDeletedAt() != null
                : conversation.getParticipantTwoDeletedAt() != null;
    }

    private void restoreFor(Conversation conversation, Long userId) {
        if (conversation.getParticipantOneId().equals(userId)) {
            conversation.setParticipantOneDeletedAt(null);
        } else {
            conversation.setParticipantTwoDeletedAt(null);
        }
    }

    @Transactional
    public ConversationResponse openConversation(Long peerId) {
        Long userId = currentUserId();
        if (userId.equals(peerId)) {
            throw new IllegalArgumentException("Нельзя начать диалог с самим собой");
        }
        User peer = userRepository.findById(peerId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден"));
        long first = Math.min(userId, peer.getId());
        long second = Math.max(userId, peer.getId());
        Conversation conversation = conversationRepository.findByParticipantOneIdAndParticipantTwoId(first, second)
                .orElseGet(() -> conversationRepository.save(Conversation.builder()
                        .participantOneId(first)
                        .participantTwoId(second)
                        .build()));
        restoreFor(conversation, userId);
        conversationRepository.save(conversation);
        return toConversationResponse(conversation, userId);
    }

    public List<ChatMessageResponse> getMessages(Long conversationId) {
        Conversation conversation = getAccessibleConversation(conversationId);
        return messageRepository.findTop100ByConversationIdOrderByCreatedAtDesc(conversation.getId())
                .stream().sorted(Comparator.comparing(ChatMessage::getCreatedAt))
                .map(this::toMessageResponse).toList();
    }

    @Transactional
    public ChatMessageResponse sendMessage(Long conversationId, SendMessageRequest request) {
        Conversation conversation = getAccessibleConversation(conversationId);
        Long senderId = currentUserId();
        Long recipientId = conversation.getParticipantOneId().equals(senderId)
                ? conversation.getParticipantTwoId() : conversation.getParticipantOneId();
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден"));
        String content = request.getContent().trim();
        ChatMessage message = messageRepository.save(ChatMessage.builder()
                .conversationId(conversationId)
                .senderId(senderId)
                .content(content)
                .build());
        restoreFor(conversation, senderId);
        restoreFor(conversation, recipientId);
        conversation.setLastMessageAt(message.getCreatedAt());
        conversationRepository.save(conversation);
        String senderName = sender.getFirstName() + " " + sender.getLastName();
        notificationService.create(recipientId, senderId, NotificationType.NEW_MESSAGE,
                "Новое сообщение", senderName + ": " + preview(content), "/messages/" + senderId);
        return toMessageResponse(message);
    }

    @Transactional
    public void markRead(Long conversationId) {
        Conversation conversation = getAccessibleConversation(conversationId);
        messageRepository.markConversationRead(conversation.getId(), currentUserId());
    }

    public long getUnreadCount() {
        return messageRepository.countUnreadForRecipient(currentUserId());
    }

    private Conversation getAccessibleConversation(Long conversationId) {
        Long userId = currentUserId();
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Диалог не найден"));
        if (!conversation.getParticipantOneId().equals(userId) && !conversation.getParticipantTwoId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Нет доступа к диалогу");
        }
        return conversation;
    }

    private ConversationResponse toConversationResponse(Conversation conversation, Long userId) {
        Long peerId = conversation.getParticipantOneId().equals(userId)
                ? conversation.getParticipantTwoId() : conversation.getParticipantOneId();
        User peer = userRepository.findById(peerId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден"));
        List<ChatMessage> messages = messageRepository.findTop100ByConversationIdOrderByCreatedAtDesc(conversation.getId());
        String lastMessage = messages.isEmpty() ? "" : messages.get(0).getContent();
        return ConversationResponse.builder()
                .id(conversation.getId())
                .peer(UserShortResponse.builder().id(peer.getId()).firstName(peer.getFirstName())
                        .lastName(peer.getLastName()).avatarUrl(peer.getAvatarUrl()).build())
                .lastMessage(lastMessage)
                .lastMessageAt(conversation.getLastMessageAt())
                .unreadCount(messageRepository.countByConversationIdAndSenderIdNotAndReadAtIsNull(conversation.getId(), userId))
                .build();
    }

    private ChatMessageResponse toMessageResponse(ChatMessage message) {
        return ChatMessageResponse.builder().id(message.getId()).senderId(message.getSenderId())
                .content(message.getContent()).createdAt(message.getCreatedAt()).readAt(message.getReadAt()).build();
    }

    private String preview(String content) {
        return content.length() <= 120 ? content : content.substring(0, 117) + "...";
    }

    private Long currentUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}