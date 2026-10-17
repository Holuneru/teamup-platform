package com.teamup.service;

import com.teamup.dto.request.CreateHackathonRequest;
import com.teamup.dto.response.HackathonResponse;
import com.teamup.entity.Hackathon;
import com.teamup.enums.HackathonFormat;
import com.teamup.exception.ResourceNotFoundException;
import com.teamup.mapper.HackathonMapper;
import com.teamup.repository.HackathonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HackathonService {

    private final HackathonRepository hackathonRepository;
    private final HackathonMapper hackathonMapper;

    public List<HackathonResponse> findAll(HackathonFormat format, LocalDate fromDate) {
        return hackathonRepository.findAllByOrderByDeadlineAsc().stream()
                .filter(hackathon -> format == null || hackathon.getFormat() == format)
                .filter(hackathon -> fromDate == null
                        || (hackathon.getDeadline() != null && !hackathon.getDeadline().isBefore(fromDate)))
                .map(hackathonMapper::toResponse)
                .toList();
    }

    public HackathonResponse getById(Long id) {
        return hackathonMapper.toResponse(getEntity(id));
    }

    public HackathonResponse create(CreateHackathonRequest request) {
        Hackathon hackathon = Hackathon.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .deadline(request.getDeadline())
                .location(request.getLocation())
                .format(request.getFormat())
                .prize(request.getPrize())
                .link(request.getLink())
                .build();

        return hackathonMapper.toResponse(hackathonRepository.save(hackathon));
    }

    public HackathonResponse update(Long id, CreateHackathonRequest request) {
        Hackathon hackathon = getEntity(id);

        hackathon.setTitle(request.getTitle());
        hackathon.setDescription(request.getDescription());
        hackathon.setDeadline(request.getDeadline());
        hackathon.setLocation(request.getLocation());
        hackathon.setFormat(request.getFormat());
        hackathon.setPrize(request.getPrize());
        hackathon.setLink(request.getLink());

        return hackathonMapper.toResponse(hackathonRepository.save(hackathon));
    }

    public void delete(Long id) {
        Hackathon hackathon = getEntity(id);
        hackathonRepository.delete(hackathon);
    }

    private Hackathon getEntity(Long id) {
        return hackathonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Хакатон с id = " + id + " не найден"));
    }
}
