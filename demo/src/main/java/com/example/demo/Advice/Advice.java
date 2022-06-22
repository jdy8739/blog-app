package com.example.demo.Advice;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@Controller("com.example.demo.controller")
public class Advice {

    @ExceptionHandler(IllegalArgumentException.class)
    public ExceptionDTO handleIllegalArgumentException() {
        return new ExceptionDTO(
                ExceptionInfo.UnavailableCookieInfo.getCode(),
                ExceptionInfo.UnrecognizedRole.getDescription());
    }
}
