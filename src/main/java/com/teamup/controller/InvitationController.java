package com.teamup.controller;

import com.teamup.dto.response.InvitationResponse;
import com.teamup.service.InvitationService;
import com.teamup.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invitations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class InvitationController {

    private final InvitationService invitationService;
    private final UserService userService;

    // =====================================
    // Пригласить пользователя в проект
    // POST /api/invitations/project/5/user/12
    // =====================================

    @PostMapping("/project/{projectId}/user/{userId}")
    public InvitationResponse invite(

            @PathVariable Long projectId,
            @PathVariable Long userId

    ) {

        return invitationService.invite(projectId, userId);

    }

    // =====================================
    // Мои приглашения
    // GET /api/invitations/me
    // =====================================

    @GetMapping("/me")
    public List<InvitationResponse> getMyInvitations(

            @RequestHeader("Authorization") String authHeader

    ) {

        String token = authHeader.substring(7);

        Long userId = userService.extractUserId(token);

        return invitationService.getMyInvitations(userId);

    }

    // =====================================
    // Принять приглашение
    // POST /api/invitations/{id}/accept
    // =====================================

    @PostMapping("/{id}/accept")
    public InvitationResponse accept(

            @PathVariable Long id

    ) {

        return invitationService.accept(id);

    }

    // =====================================
    // Отклонить приглашение
    // POST /api/invitations/{id}/reject
    // =====================================

    @PostMapping("/{id}/reject")
    public InvitationResponse reject(

            @PathVariable Long id

    ) {

        return invitationService.reject(id);

    }

    @GetMapping("/status/user/{userId}")
    public List<String> getInvitationStatuses(

            @PathVariable Long userId

    ) {

        return invitationService.getInvitationStatuses(userId);

    }

}