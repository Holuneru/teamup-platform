package com.teamup.mapper;

import com.teamup.dto.response.HackathonResponse;
import com.teamup.entity.Hackathon;
import org.springframework.stereotype.Component;

@Component
public class HackathonMapper {

    public HackathonResponse toResponse(Hackathon hackathon) {
        return HackathonResponse.builder()
                .id(hackathon.getId())
                .title(hackathon.getTitle())
                .description(hackathon.getDescription())
                .deadline(hackathon.getDeadline())
                .location(hackathon.getLocation())
                .format(hackathon.getFormat())
                .prize(hackathon.getPrize())
                .link(hackathon.getLink())
                .build();
    }
}
