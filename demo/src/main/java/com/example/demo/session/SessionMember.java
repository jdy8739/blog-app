package com.example.demo.session;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class SessionMember {
    private String id;
    private String auth;

    @Override
    public String toString() {
        return "id: " + this.id + ", auth: " + this.auth;
    }
}
