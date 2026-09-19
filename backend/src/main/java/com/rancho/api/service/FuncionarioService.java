package com.rancho.api.service;

import com.rancho.api.dto.FuncionarioRequest;
import com.rancho.api.entity.Funcionario;
import com.rancho.api.repository.FuncionarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class FuncionarioService {
    private final FuncionarioRepository repository;

    public FuncionarioService(FuncionarioRepository repository) { this.repository = repository; }

    public List<Funcionario> listar(String busca) {
        return busca == null || busca.isBlank()
                ? repository.findByAtivoTrueOrderByNomeAsc()
                : repository.findByAtivoTrueAndNomeContainingIgnoreCaseOrderByNomeAsc(busca.trim());
    }

    @Transactional
    public Funcionario criar(FuncionarioRequest request) {
        return repository.save(preencher(new Funcionario(), request));
    }

    @Transactional
    public Funcionario atualizar(Long id, FuncionarioRequest request) {
        Funcionario funcionario = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado."));
        return repository.save(preencher(funcionario, request));
    }

    @Transactional
    public void remover(Long id) {
        Funcionario funcionario = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado."));
        funcionario.setAtivo(false);
        repository.save(funcionario);
    }

    private Funcionario preencher(Funcionario funcionario, FuncionarioRequest request) {
        funcionario.setNome(request.nome());
        funcionario.setArea(request.area());
        funcionario.setTelefone(request.telefone());
        funcionario.setCep(request.cep());
        funcionario.setChavePix(request.chavePix());
        funcionario.setValorDiaria(request.valorDiaria());
        funcionario.setAjudaTransporte(request.ajudaTransporte());
        funcionario.setAtivo(true);
        return funcionario;
    }
}