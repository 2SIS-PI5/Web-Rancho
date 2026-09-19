package com.rancho.api.service;

import com.rancho.api.repository.EscalaRepository;
import com.rancho.api.repository.FuncionarioRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.Map;

@Service
public class DashboardService {
    private final FuncionarioRepository funcionarios;
    private final EscalaRepository escalas;

    public DashboardService(FuncionarioRepository funcionarios, EscalaRepository escalas) {
        this.funcionarios = funcionarios;
        this.escalas = escalas;
    }

    public Map<String, Long> resumo() {
        return Map.of("funcionariosAtivos", funcionarios.countByAtivoTrue(),
                "escalasFuturas", escalas.countByDataGreaterThanEqual(LocalDate.now()));
    }
}