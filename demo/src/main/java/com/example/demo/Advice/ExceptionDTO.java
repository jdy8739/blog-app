package com.example.demo.Advice;

import lombok.Getter;

@Getter
public class ExceptionDTO {
    private int code;
    private String description;
    public ExceptionDTO(int code, String description) {
        this.code = code;
        this.description = description;
    }
}
