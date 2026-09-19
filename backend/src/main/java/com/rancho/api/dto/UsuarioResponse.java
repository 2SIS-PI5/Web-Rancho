package com.rancho.api.dto;

import com.rancho.api.entity.Usuario;

public record UsuarioResponse(Long id, String nome, String email, String perfil, boolean ativo) {
    public static UsuarioResponse from(Usuario usuario) {
        return new UsuarioResponse(usuario.getId(), usuario.getNome(), usuario.getEmail(), usuario.getPerfil(), usuario.isAtivo());
    }
}