package com.rancho.api.controller;

import com.rancho.api.dto.EscalaRequest;
import com.rancho.api.entity.Escala;
import com.rancho.api.service.EscalaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/escalas")
public class EscalaController {
    private final EscalaService service;
    public EscalaController(EscalaService service) { this.service = service; }

    @GetMapping
    public List<Escala> listar(@RequestParam(required = false) LocalDate inicio,
                               @RequestParam(required = false) LocalDate fim) { return service.listar(inicio, fim); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Escala criar(@Valid @RequestBody EscalaRequest request) { return service.criar(request); }

    @PatchMapping("/{id}/status")
    public Escala atualizarStatus(@PathVariable Long id, @RequestParam String status) {
        return service.atualizarStatus(id, status);
    }

    @PutMapping("/{id}")
    public Escala atualizar(@PathVariable Long id, @Valid @RequestBody EscalaRequest request) {
        return service.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable Long id) { service.remover(id); }
}