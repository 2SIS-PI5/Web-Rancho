package com.rancho.api.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record FuncionarioRequest(
        @NotBlank @Size(max = 120) String nome,
        @NotBlank @Size(max = 30) String area,
        @Size(max = 30) String telefone,
        @Size(max = 9) String cep,
        @Size(max = 120) String chavePix,
        @NotNull @DecimalMin("0.0") BigDecimal valorDiaria,
        boolean ajudaTransporte) {}