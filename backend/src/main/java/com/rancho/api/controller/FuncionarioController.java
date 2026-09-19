package com.rancho.api.controller;

import com.rancho.api.dto.FuncionarioRequest;
import com.rancho.api.entity.Funcionario;
import com.rancho.api.service.FuncionarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/funcionarios")
public class FuncionarioController {
    private final FuncionarioService service;
    public FuncionarioController(FuncionarioService service) { this.service = service; }

    @GetMapping
    public List<Funcionario> listar(@RequestParam(required = false) String busca) { return service.listar(busca); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Funcionario criar(@Valid @RequestBody FuncionarioRequest request) { return service.criar(request); }

    @PutMapping("/{id}")
    public Funcionario atualizar(@PathVariable Long id, @Valid @RequestBody FuncionarioRequest request) {
        return service.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable Long id) { service.remover(id); }
}