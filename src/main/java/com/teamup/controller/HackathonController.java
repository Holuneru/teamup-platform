package com.teamup.controller;

import com.teamup.dto.request.CreateHackathonRequest;
import com.teamup.dto.response.HackathonResponse;
import com.teamup.enums.HackathonFormat;
import com.teamup.service.HackathonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/hackathons")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class HackathonController {

    private final HackathonService hackathonService;

    @GetMapping
    public List<HackathonResponse> getAll(
            @RequestParam(required = false) HackathonFormat format,
            @RequestParam(required = false) LocalDate from
    ) {
        return hackathonService.findAll(format, from);
    }

    @GetMapping("/{id}")
    public HackathonResponse getById(@PathVariable Long id) {
        return hackathonService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HackathonResponse create(@Valid @RequestBody CreateHackathonRequest request) {
        return hackathonService.create(request);
    }

    @PutMapping("/{id}")
    public HackathonResponse update(
            @PathVariable Long id,
            @Valid @RequestBody CreateHackathonRequest request
    ) {
        return hackathonService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        hackathonService.delete(id);
    }
}
