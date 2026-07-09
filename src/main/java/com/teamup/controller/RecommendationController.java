package com.teamup.controller;

import com.teamup.dto.response.UserRecommendationResponse;
import com.teamup.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/project/{projectId}")
    public List<UserRecommendationResponse> getRecommendations(
            @PathVariable Long projectId
    ) {

        return recommendationService.getRecommendations(projectId);

    }

}