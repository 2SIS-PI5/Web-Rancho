package com.rancho.api.service;

import com.rancho.api.dto.CadastroRequest;
import com.rancho.api.dto.LoginRequest;
import com.rancho.api.dto.LoginResponse;
import com.rancho.api.entity.Usuario;
import com.rancho.api.repository.UsuarioRepository;
import com.rancho.api.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final UsuarioRepository usuarios;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarios, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, JwtService jwtService) {
        this.usuarios = usuarios;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Transactional
    public LoginResponse cadastrar(CadastroRequest request) {
        if (usuarios.existsByEmailIgnoreCaseAndAtivoTrue(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado.");
        }
        Usuario usuario = new Usuario();
        usuario.setNome(request.nome());
        usuario.setEmail(request.email().trim().toLowerCase());
        usuario.setSenha(passwordEncoder.encode(request.senha()));
        usuario = usuarios.save(usuario);
        return emitirToken(usuario);
    }

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email().trim().toLowerCase(), request.senha()));
        return emitirToken(usuarios.findByEmailIgnoreCaseAndAtivoTrue(request.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas.")));
    }

    private LoginResponse emitirToken(Usuario usuario) {
        String token = jwtService.gerarToken(User.withUsername(usuario.getEmail())
                .password(usuario.getSenha()).roles(usuario.getPerfil()).build());
        return new LoginResponse(token, new LoginResponse.UsuarioResponse(
                usuario.getId(), usuario.getNome(), usuario.getEmail(), usuario.getPerfil()));
    }
}