package com.example.demo.controller;

import com.example.demo.DTO.MemberDTO;
import com.example.demo.service.MemberService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@Slf4j
@Controller
@RequestMapping("/member")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class MemberController {

    @Autowired
    MemberService memberService;

    @PostMapping("/signin")
    public ResponseEntity<Void> signin(
            @RequestHeader Map<String, Object> requestHeader,
            @Validated @RequestBody MemberDTO memberDTO) {
        String auth = (String) requestHeader.get("auth");
        log.info(auth);
        log.info("signin: " + memberDTO.toString());

        if(!memberService.login(memberDTO))
            return new ResponseEntity<Void>(HttpStatus.resolve(401));

        HttpHeaders headers = new HttpHeaders();
        headers.set("token", auth);

        return ResponseEntity.ok()
                .headers(headers)
                .body(null);
    }

    @PostMapping("/signup")
    public ResponseEntity<Void> signup(@Validated @RequestBody MemberDTO memberDTO) {
        log.info("signup: " + memberDTO.toString());
        memberService.saveMember(memberDTO);
        return new ResponseEntity<Void>(HttpStatus.OK);
    }
}
