package com.example.demo.Advice;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;

@Slf4j
@RestControllerAdvice("com.example.demo.controller")
public class Advice {

    @ExceptionHandler(IllegalArgumentException.class)
    public ExceptionDTO handleIllegalArgumentException() {
        return new ExceptionDTO(
                ExceptionInfo.UnavailableCookieInfo.getCode(),
                ExceptionInfo.UnavailableCookieInfo.getDescription());
    }

    @ExceptionHandler(HttpClientErrorException.Unauthorized.class)
    public ResponseEntity<Void> handleHttpClientErrorException() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("isValidToken", "false");
        return ResponseEntity.status(401)
                .headers(headers)
                .body(null);
    }
}
