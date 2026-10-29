package com.teamup.service;

import com.teamup.dto.request.SendMessageRequest;
import com.teamup.entity.ChatMessage;
import com.teamup.entity.Conversation;
import com.teamup.entity.User;
import com.teamup.repository.ChatMessageRepository;
import com.teamup.repository.ConversationRepository;
import com.teamup.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ChatServiceTest {

    private static final Long FIRST_USER_ID = 10L;
    private static final Long SECOND_USER_ID = 20L;
    private static final Long CONVERSATION_ID = 30L;

    private ConversationRepository conversationRepository;
    private ChatMessageRepository messageRepository;
    private UserRepository userRepository;
    private ChatService chatService;
    private Conversation conversation;

    @BeforeEach
    void setUp() {
        conversationRepository = mock(ConversationRepository.class);
        messageRepository = mock(ChatMessageRepository.class);
        userRepository = mock(UserRepository.class);
        chatService = new ChatService(
                conversationRepository,
                messageRepository,
            userRepository
        );
        conversation = Conversation.builder()
                .id(CONVERSATION_ID)
                .participantOneId(FIRST_USER_ID)
                .participantTwoId(SECOND_USER_ID)
                .lastMessageAt(LocalDateTime.now())
                .build();
        when(conversationRepository.findById(CONVERSATION_ID)).thenReturn(Optional.of(conversation));
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void deleteConversationHidesItOnlyForCurrentUser() {
        authenticate(FIRST_USER_ID);

        chatService.deleteConversation(CONVERSATION_ID);

        assertNotNull(conversation.getParticipantOneDeletedAt());
        assertNull(conversation.getParticipantTwoDeletedAt());
        verify(conversationRepository).save(conversation);

        authenticate(SECOND_USER_ID);
        when(conversationRepository.findByParticipantOneIdOrParticipantTwoIdOrderByLastMessageAtDesc(
                SECOND_USER_ID, SECOND_USER_ID
        )).thenReturn(List.of(conversation));
        when(userRepository.findById(FIRST_USER_ID)).thenReturn(Optional.of(user(FIRST_USER_ID)));
        when(messageRepository.findTop100ByConversationIdOrderByCreatedAtDesc(CONVERSATION_ID)).thenReturn(List.of());
        when(messageRepository.countByConversationIdAndSenderIdNotAndReadAtIsNull(CONVERSATION_ID, SECOND_USER_ID))
                .thenReturn(0L);

        assertEquals(1, chatService.getConversations().size());
    }

    @Test
    void deleteConversationBySecondParticipantDoesNotHideItForFirst() {
        authenticate(SECOND_USER_ID);

        chatService.deleteConversation(CONVERSATION_ID);

        assertNull(conversation.getParticipantOneDeletedAt());
        assertNotNull(conversation.getParticipantTwoDeletedAt());
    }

    @Test
    void messageRestoresConversationForBothParticipants() {
        conversation.setParticipantOneDeletedAt(LocalDateTime.now().minusDays(1));
        conversation.setParticipantTwoDeletedAt(LocalDateTime.now().minusDays(1));
        authenticate(FIRST_USER_ID);
        when(messageRepository.save(any(ChatMessage.class))).thenAnswer(invocation -> {
            ChatMessage message = invocation.getArgument(0);
            message.setId(100L);
            message.setCreatedAt(LocalDateTime.now());
            return message;
        });
        SendMessageRequest request = new SendMessageRequest();
        request.setContent("Привет");

        chatService.sendMessage(CONVERSATION_ID, request);

        assertNull(conversation.getParticipantOneDeletedAt());
        assertNull(conversation.getParticipantTwoDeletedAt());
        verify(conversationRepository).save(conversation);
    }

    @Test
    void nonParticipantCannotDeleteConversation() {
        authenticate(99L);

        assertThrows(
                org.springframework.security.access.AccessDeniedException.class,
                () -> chatService.deleteConversation(CONVERSATION_ID)
        );

        verify(conversationRepository, never()).save(any(Conversation.class));
    }

    private void authenticate(Long userId) {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(userId, null, List.of())
        );
    }

    private User user(Long userId) {
        return User.builder()
                .id(userId)
                .firstName("User")
                .lastName(userId.toString())
                .build();
    }
}