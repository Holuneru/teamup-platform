package com.teamup.controller;

import com.teamup.dto.response.UserRecommendationResponse;
import com.teamup.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/{userId}")
    public List<UserRecommendationResponse> getRecommendations(
            @PathVariable Long userId
    ) {
        return recommendationService.getRecommendations(userId);
    }
}