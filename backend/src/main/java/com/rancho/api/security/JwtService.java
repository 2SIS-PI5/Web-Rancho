package com.rancho.api.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {
    private final Key signingKey;
    private final long expiration;

    public JwtService(@Value("${jwt.secret}") String secret, @Value("${jwt.expiration}") long expiration) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiration = expiration;
    }

    public String gerarToken(UserDetails user) {
        Date agora = new Date();
        return Jwts.builder().setSubject(user.getUsername()).setIssuedAt(agora)
                .setExpiration(new Date(agora.getTime() + expiration))
                .signWith(signingKey, SignatureAlgorithm.HS256).compact();
    }

    public String extrairUsuario(String token) { return extrairClaim(token, Claims::getSubject); }

    public boolean tokenValido(String token, UserDetails user) {
        return user.getUsername().equalsIgnoreCase(extrairUsuario(token)) && !expirado(token);
    }

    private boolean expirado(String token) { return extrairClaim(token, Claims::getExpiration).before(new Date()); }

    private <T> T extrairClaim(String token, Function<Claims, T> resolver) {
        return resolver.apply(Jwts.parserBuilder().setSigningKey(signingKey).build()
                .parseClaimsJws(token).getBody());
    }
}