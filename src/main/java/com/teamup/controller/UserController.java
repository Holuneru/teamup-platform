package com.teamup.controller;

import com.teamup.service.AvatarService;
import org.springframework.web.multipart.MultipartFile;
import com.teamup.dto.request.UpdateSkillsRequest;
import com.teamup.dto.request.UpdateUserRequest;
import com.teamup.dto.response.SkillResponse;
import com.teamup.dto.response.UserResponse;
import com.teamup.service.SkillService;
import com.teamup.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;
    private final SkillService skillService;
    private final AvatarService avatarService;

    @GetMapping("/{id}")
    public UserResponse getUser(@PathVariable Long id) {

        return userService.getUserById(id);

    }

    @PutMapping("/{userId}/skills")
    public List<SkillResponse> updateUserSkills(

            @PathVariable Long userId,
            @RequestBody UpdateSkillsRequest request

    ) {

        return skillService.updateUserSkills(userId, request);

    }

    @GetMapping("/me")
    public UserResponse getMe(
            @RequestHeader("Authorization") String authHeader
    ) {

        return userService.getMe(authHeader);

    }

    // ==========================
    // UPDATE PROFILE
    // ==========================

    @PutMapping("/me")
    public UserResponse updateMe(

            @RequestHeader("Authorization") String authHeader,

            @RequestBody UpdateUserRequest request

    ) {

        return userService.updateMe(authHeader, request);

    }

    @PostMapping("/me/avatar")
    public String uploadAvatar(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("file") MultipartFile file
    ) throws Exception {

        String token = authHeader.substring(7);

        Long userId = userService.extractUserId(token);

        return avatarService.uploadAvatar(userId, file);
    }

}