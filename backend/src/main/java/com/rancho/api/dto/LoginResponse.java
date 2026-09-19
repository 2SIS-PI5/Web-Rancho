package com.rancho.api.dto;

public record LoginResponse(String token, UsuarioResponse user) {
    public record UsuarioResponse(Long id, String nome, String email, String perfil) {}
}