package com.example.demo.JWT;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Duration;
import java.util.Date;

public class JWTUtils {

    private final String SECRET_KEY = "secret_key";

    private final String BEARER = "Bearer ";

    public Claims parseJwtToken(String authorizationHeader) {

        validateAuthorizationHeader(authorizationHeader);
        String token = extractToken(authorizationHeader);

        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }

    private void validateAuthorizationHeader(String header) {
        if (header == null || !header.startsWith(BEARER)) {
            throw new IllegalArgumentException();
        }
    }

    private String extractToken(String authorizationHeader) {
        return authorizationHeader.substring(BEARER.length());
    }

    public String makeJWT(String id, String auth) {
        Date now = new Date();
        String jwt = Jwts.builder()
                .setHeaderParam(Header.TYPE, Header.JWT_TYPE)
                .setIssuer("fresh")
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + Duration.ofMinutes(180).toMillis()))
                .claim("id", id)
                .claim("auth", auth)
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
        return jwt;
    }

    public Claims filterInternal(String token
            //FilterChain filterChain
    ) throws IOException, ServletException {
        Claims claims = parseJwtToken(token);
        System.out.println(claims);
        return claims;
        //filterChain.doFilter(request, response);
    }
}
