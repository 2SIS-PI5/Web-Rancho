package com.rancho.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record EscalaRequest(@NotNull LocalDate data, @NotBlank String area, @NotNull Long funcionarioId, String status) {}