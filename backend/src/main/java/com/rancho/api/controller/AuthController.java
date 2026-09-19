package com.rancho.api.controller;

import com.rancho.api.dto.CadastroRequest;
import com.rancho.api.dto.LoginRequest;
import com.rancho.api.dto.LoginResponse;
import com.rancho.api.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService service;
    public AuthController(AuthService service) { this.service = service; }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) { return service.login(request); }

    @PostMapping({"/cadastro", "/register"})
    @ResponseStatus(HttpStatus.CREATED)
    public LoginResponse cadastrar(@Valid @RequestBody CadastroRequest request) { return service.cadastrar(request); }
}