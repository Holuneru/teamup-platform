package com.teamup.controller;

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
public class UserController {

    private final UserService userService;
    private final SkillService skillService;

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

}