package com.teamup.repository;

import com.teamup.entity.Hackathon;
import com.teamup.enums.HackathonFormat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HackathonRepository extends JpaRepository<Hackathon, Long> {

    List<Hackathon> findAllByOrderByDeadlineAsc();

    List<Hackathon> findByFormat(HackathonFormat format);

    List<Hackathon> findByDeadlineGreaterThanEqual(LocalDate date);
}
