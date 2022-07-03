package com.example.demo.utils;

import com.example.demo.JWT.JWTUtils;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Service;

@Service
public class Utils {

    JWTUtils jwtUtils = new JWTUtils();

    private final String ID = "id";

    public String getUserId(String authHeader) throws IllegalArgumentException {
        if (authHeader == null) return null;
        else return (String) jwtUtils.filterInternal(authHeader).get(ID);
    }
}
