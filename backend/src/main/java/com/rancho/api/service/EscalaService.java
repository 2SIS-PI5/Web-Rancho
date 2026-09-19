package com.rancho.api.service;

import com.rancho.api.dto.EscalaRequest;
import com.rancho.api.entity.Escala;
import com.rancho.api.repository.EscalaRepository;
import com.rancho.api.repository.FuncionarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import java.util.List;

@Service
public class EscalaService {
    private final EscalaRepository escalas;
    private final FuncionarioRepository funcionarios;

    public EscalaService(EscalaRepository escalas, FuncionarioRepository funcionarios) {
        this.escalas = escalas;
        this.funcionarios = funcionarios;
    }

    public List<Escala> listar(LocalDate inicio, LocalDate fim) {
        LocalDate primeiro = inicio == null ? LocalDate.now() : inicio;
        LocalDate ultimo = fim == null ? primeiro.plusDays(30) : fim;
        return escalas.findByDataBetweenOrderByDataAscAreaAsc(primeiro, ultimo);
    }

    @Transactional
    public Escala criar(EscalaRequest request) {
        Escala escala = new Escala();
        escala.setData(request.data());
        escala.setArea(request.area());
        escala.setStatus(request.status() == null || request.status().isBlank() ? "PLANEJADA" : request.status());
        escala.setFuncionario(funcionarios.findById(request.funcionarioId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado.")));
        return escalas.save(escala);
    }

    @Transactional
    public Escala atualizarStatus(Long id, String status) {
        Escala escala = escalas.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Escala não encontrada."));
        escala.setStatus(status);
        return escalas.save(escala);
    }

    @Transactional
    public Escala atualizar(Long id, EscalaRequest request) {
        Escala escala = escalas.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Escala não encontrada."));
        escala.setData(request.data());
        escala.setArea(request.area());
        escala.setStatus(request.status() == null || request.status().isBlank() ? escala.getStatus() : request.status());
        escala.setFuncionario(funcionarios.findById(request.funcionarioId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado.")));
        return escalas.save(escala);
    }

    @Transactional
    public void remover(Long id) {
        if (!escalas.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Escala não encontrada.");
        escalas.deleteById(id);
    }
}