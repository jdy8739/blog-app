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
    public ResponseEntity<ExceptionDTO> handleIllegalArgumentException() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("isValidToken", "false");
        return ResponseEntity.status(401)
                .headers(headers)
                .body(new ExceptionDTO(ExceptionInfo.UnauthorizedUserInfo.getCode(),
                        ExceptionInfo.UnauthorizedUserInfo.getDescription()));
    }

    @ExceptionHandler(HttpClientErrorException.class)
    public ResponseEntity<ExceptionDTO> handleForbiddenException() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("isEligibleUser", "false");
        return ResponseEntity.status(403)
                .headers(headers)
                .body(new ExceptionDTO(ExceptionInfo.CannotAccessUserInfo.getCode(),
                        ExceptionInfo.CannotAccessUserInfo.getDescription()));
    }

    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<ExceptionDTO> handleNullPointerException() {
        return ResponseEntity.status(500)
                .headers(new HttpHeaders())
                .body(new ExceptionDTO(ExceptionInfo.NotFoundInfo.getCode(),
                        ExceptionInfo.NotFoundInfo.getDescription()));
    }
}
