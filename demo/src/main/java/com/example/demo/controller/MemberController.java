package com.example.demo.controller;

import com.example.demo.DTO.MemberDTO;
import com.example.demo.DTO.ReplyDTO;
import com.example.demo.JWT.JWTUtils;
import com.example.demo.service.MemberService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Slf4j
@Controller
@RequestMapping("/member")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class MemberController {

    @Autowired
    MemberService memberService;

    JWTUtils jwtUtils = new JWTUtils();

    private final String ID = "id";

    @PostMapping("/signin")
    public ResponseEntity<String> signin(
            @Validated @RequestBody MemberDTO memberDTO) {
        HttpHeaders headers = new HttpHeaders();
        MemberDTO loggedInMember = memberService.login(memberDTO);
        if(loggedInMember == null)
            return new ResponseEntity<String>(HttpStatus.OK);
        String jwt = jwtUtils.makeJWT(
                loggedInMember.getId(), loggedInMember.getAuth());
        //headers.set("Authorization", auth);
        headers.set("Access-Control-Expose-Headers", "*, Authorization, Set-Cookie");
        return ResponseEntity.ok()
                .headers(headers)
                .body(jwt);
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@Validated @RequestBody MemberDTO memberDTO) {
        log.info("signup: " + memberDTO.toString());

        boolean isMemberSaved = memberService.saveMember(memberDTO);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Access-Control-Expose-Headers", "*");
        headers.set("isMemberSaved", String.valueOf(isMemberSaved));

        return new ResponseEntity<String>(null, headers, HttpStatus.OK);
    }

    @PutMapping("/handleLikesCount")
    public ResponseEntity<Void> handleLikesCount(@RequestBody Map<String, String> map,
            HttpServletRequest req) {
        HttpHeaders headers = new HttpHeaders();
        String id = map.get("id");
        Integer postNo = Integer.parseInt(map.get("postNo"));
        boolean isLiked = Boolean.parseBoolean(map.get("isLiked"));
        String authorizationHeader = req.getHeader(HttpHeaders.AUTHORIZATION);
        Claims claims = jwtUtils.filterInternal(authorizationHeader);
        if(claims.get(ID).equals(id)) {
            if (isLiked) memberService.cancelLike(id, postNo);
            else memberService.addLike(id, postNo);
        } else {
            throw new HttpClientErrorException(HttpStatus.FORBIDDEN);
        }
        return ResponseEntity.ok()
                .headers(headers)
                .body(null);
    }
}