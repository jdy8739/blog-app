package com.example.demo.controller;

import com.example.demo.DTO.MemberDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Controller
@RequestMapping("/member")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class MemberController {

    @PostMapping("/signin")
    public ResponseEntity<Void> signin(@Validated @RequestBody  MemberDTO memberDTO) {
        log.info("signin: " + memberDTO.toString());
        return new ResponseEntity<Void>(HttpStatus.OK);
    };

}
