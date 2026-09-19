package com.rancho.api.repository;

import com.rancho.api.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmailIgnoreCaseAndAtivoTrue(String email);
    boolean existsByEmailIgnoreCaseAndAtivoTrue(String email);
    List<Usuario> findByAtivoTrueOrderByNomeAsc();
}