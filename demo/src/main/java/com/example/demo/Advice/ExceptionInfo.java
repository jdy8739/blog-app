package com.example.demo.Advice;

public enum ExceptionInfo {
    UnavailableCookieInfo(6000,
            "There is an issue on your sign in. Please sign in again."),
    DuplicateIdFound(6001,"Duplicate Id"),

    UnrecognizedRole(6010,"Unrecognized Role");

    private int code;
    private String description;
    ExceptionInfo(int code, String description) {
        this.code = code;
        this.description = description;
    }

    public int getCode() {
        return code;
    }
    public String getDescription() {
        return description;
    }
}
