package com.rancho.api.repository;

import com.rancho.api.entity.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {
    List<Funcionario> findByAtivoTrueOrderByNomeAsc();
    List<Funcionario> findByAtivoTrueAndNomeContainingIgnoreCaseOrderByNomeAsc(String nome);
    long countByAtivoTrue();
}