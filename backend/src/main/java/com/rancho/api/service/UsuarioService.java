package com.rancho.api.service;

import com.rancho.api.dto.UsuarioResponse;
import com.rancho.api.dto.UsuarioUpdateRequest;
import com.rancho.api.entity.Usuario;
import com.rancho.api.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarios;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarios, PasswordEncoder passwordEncoder) {
        this.usuarios = usuarios;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UsuarioResponse> listar() {
        return usuarios.findByAtivoTrueOrderByNomeAsc().stream().map(UsuarioResponse::from).toList();
    }

    @Transactional
    public UsuarioResponse atualizar(Long id, UsuarioUpdateRequest request) {
        Usuario usuario = buscar(id);
        String email = request.email().trim().toLowerCase();
        usuarios.findByEmailIgnoreCaseAndAtivoTrue(email).ifPresent(outro -> {
            if (!outro.getId().equals(id)) throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado.");
        });
        usuario.setNome(request.nome());
        usuario.setEmail(email);
        usuario.setPerfil(request.perfil().trim().toUpperCase());
        if (request.senha() != null && !request.senha().isBlank()) usuario.setSenha(passwordEncoder.encode(request.senha()));
        return UsuarioResponse.from(usuarios.save(usuario));
    }

    @Transactional
    public void remover(Long id) {
        Usuario usuario = buscar(id);
        usuario.setAtivo(false);
        usuarios.save(usuario);
    }

    private Usuario buscar(Long id) {
        return usuarios.findById(id).filter(Usuario::isAtivo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));
    }
}