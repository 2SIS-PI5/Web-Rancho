package com.rancho.api.repository;

import com.rancho.api.entity.Escala;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface EscalaRepository extends JpaRepository<Escala, Long> {
    List<Escala> findByDataBetweenOrderByDataAscAreaAsc(LocalDate inicio, LocalDate fim);
    long countByDataGreaterThanEqual(LocalDate data);
}