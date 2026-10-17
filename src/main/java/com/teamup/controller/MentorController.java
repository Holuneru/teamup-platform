package com.teamup.controller;

import com.teamup.dto.request.CreateMentorRequest;
import com.teamup.dto.response.MentorResponse;
import com.teamup.service.MentorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mentors")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class MentorController {

    private final MentorService mentorService;

    @GetMapping
    public List<MentorResponse> getAll() {
        return mentorService.findAll();
    }

    @GetMapping("/{id}")
    public MentorResponse getById(@PathVariable Long id) {
        return mentorService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MentorResponse create(@Valid @RequestBody CreateMentorRequest request) {
        return mentorService.create(request);
    }

    @PutMapping("/{id}")
    public MentorResponse update(
            @PathVariable Long id,
            @Valid @RequestBody CreateMentorRequest request
    ) {
        return mentorService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        mentorService.delete(id);
    }
}
