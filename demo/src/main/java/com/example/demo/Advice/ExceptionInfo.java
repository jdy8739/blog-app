package com.example.demo.Advice;

public enum ExceptionInfo {
    UnavailableCookieInfo(6000,
            "There is an issue on your sign in. Please sign in again."),
    CannotAccessUserInfo(6002,
            "You cannot access this post!"),

    UnauthorizedUserInfo(6003,
            "This is an unvalid order. Please sign in again."),

    NotFoundInfo(6007,
            "Page Not Found. :("),

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
