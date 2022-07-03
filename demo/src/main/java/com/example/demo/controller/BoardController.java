package com.example.demo.controller;

import com.example.demo.DTO.BoardDTO;
import com.example.demo.DTO.BoardWrapperDTO;
import com.example.demo.DTO.ReplyDTO;
import com.example.demo.JWT.JWTUtils;
import com.example.demo.service.BoardService;

import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Slf4j
@Controller
@RequestMapping("/posts")
@CrossOrigin(
        origins = "",
        allowedHeaders = "*")
public class BoardController {

    private final String ID = "id";

    @Autowired
    BoardService boardService;

    JWTUtils jwtUtils = new JWTUtils();

    @GetMapping("/get")
    public ResponseEntity<BoardWrapperDTO> getPosts(
            @RequestParam Integer offset,
            @RequestParam Integer limit,
            HttpServletRequest req) {
        String authorizationHeader = req.getHeader(HttpHeaders.AUTHORIZATION);
        String id = null;
        if(authorizationHeader != null) {
            Claims claims = jwtUtils.filterInternal(authorizationHeader);
            id = (String) claims.get(ID);
        }
        return new ResponseEntity<BoardWrapperDTO>(
                boardService.getPosts(offset, limit, id), HttpStatus.OK);
    }

    @GetMapping("/{subject}/{keyword}/get")
    public ResponseEntity<BoardWrapperDTO> getPostsByKeyword(
            @PathVariable String subject,
            @PathVariable String keyword,
            @RequestParam Integer offset,
            @RequestParam Integer limit,
            HttpServletRequest req) {
        String authorizationHeader = req.getHeader(HttpHeaders.AUTHORIZATION);
        String id = null;
        if(authorizationHeader != null) {
            Claims claims = jwtUtils.filterInternal(authorizationHeader);
            id = (String) claims.get(ID);
            if(subject.equals("favlist")) {
                if(!id.equals(keyword)) {
                    throw new HttpClientErrorException(HttpStatus.FORBIDDEN);
                }
            }
        }
        return ResponseEntity.ok()
                .body(boardService.getPostsByKeyword(
                        subject, keyword, offset, limit, id));
    }

    @GetMapping("/get_detail/{postNo}")
    public ResponseEntity<BoardDTO> getPost(
            @PathVariable int postNo,
            HttpServletRequest req) throws Exception {
        String requestPurpose = req.getHeader("request");
        String authorizationHeader = req.getHeader(HttpHeaders.AUTHORIZATION);
        String id = null;
        BoardDTO boardDTO = null;
        log.info("post request: " + postNo);
        if(!authorizationHeader.equals("Bearer")) {
            Claims claims = jwtUtils.filterInternal(authorizationHeader);
            id = (String) claims.get(ID);
            boardDTO = boardService.getPost(postNo, id);
            if(requestPurpose != null && requestPurpose.equals("modify")) {
                if (!id.equals(boardDTO.getWriter())) {
                    throw new HttpClientErrorException(HttpStatus.FORBIDDEN);
                }
            }
        } else {
            boardDTO = boardService.getPost(postNo, id);
        }
        return ResponseEntity.ok()
                .body(boardDTO);
    }

    @PostMapping("/add_post")
    public ResponseEntity<Void> addPost(
            @Validated @RequestBody BoardDTO boardDTO,
            HttpServletRequest req) {
        HttpHeaders headers = new HttpHeaders();
        String authorizationHeader = req.getHeader(HttpHeaders.AUTHORIZATION);
        Claims claims = jwtUtils.filterInternal(authorizationHeader);
        if(!claims.get(ID).equals(boardDTO.getWriter())) {
            throw new IllegalArgumentException();
        } else {
            boardService.savePost(boardDTO);
            log.info("Post has saved.");
        }
        return ResponseEntity.ok()
                .headers(headers)
                .body(null);
    }

    @DeleteMapping("/delete_post/{postNo}")
    public ResponseEntity<Void> deletePost(
            @PathVariable("postNo") int postNo,
            HttpServletRequest req) {
        HttpHeaders headers = new HttpHeaders();
        String authorizationHeader = req.getHeader(HttpHeaders.AUTHORIZATION);
        boolean isDeleted = false;
        Claims claims = jwtUtils.filterInternal(authorizationHeader);
        String id = (String) claims.get(ID);
        isDeleted = boardService.deletePost(postNo, id);
        if (!isDeleted) throw new HttpClientErrorException(HttpStatus.FORBIDDEN);
        return ResponseEntity.ok()
                .headers(headers)
                .body(null);
    }

    @PutMapping("/modify_post")
    ResponseEntity<Void> modifyPost(
            @Validated @RequestBody BoardDTO boardDTO,
            HttpServletRequest req) {
        HttpHeaders headers = new HttpHeaders();
        String authorizationHeader = req.getHeader(HttpHeaders.AUTHORIZATION);
        Claims claims = jwtUtils.filterInternal(authorizationHeader);
        if(!claims.get(ID).equals(boardDTO.getWriter())) {
            throw new HttpClientErrorException(HttpStatus.FORBIDDEN);
        } else {
            boardService.modifyPost(boardDTO);
            log.info("Post has modified.");
        }
        return ResponseEntity.ok()
                .headers(headers)
                .body(null);
    }

    @PostMapping("/add_reply")
    public ResponseEntity<List<ReplyDTO>> addReply(
            @Validated @RequestBody ReplyDTO replyDTO,
            HttpServletRequest req) {
        HttpHeaders headers = new HttpHeaders();
        String authorizationHeader = req.getHeader(HttpHeaders.AUTHORIZATION);
        List<ReplyDTO> targetReply = null;
        Claims claims = jwtUtils.filterInternal(authorizationHeader);
        if(claims.get(ID).equals(replyDTO.getReplier())) {
            targetReply = boardService.saveReply(replyDTO);
        } else {
            throw new IllegalArgumentException();
        }
        return ResponseEntity.ok()
                .headers(headers)
                .body(targetReply);
    }

    @DeleteMapping("/delete_reply/{postNo}/{replyNo}")
    public ResponseEntity<List<ReplyDTO>> deleteReply(
            @PathVariable("postNo") String postNo,
            @PathVariable("replyNo") String replyNo,
            HttpServletRequest req) {
        HttpHeaders headers = new HttpHeaders();
        String authorizationHeader = req.getHeader(HttpHeaders.AUTHORIZATION);
        List<ReplyDTO> targetReply = null;
        Claims claims = jwtUtils.filterInternal(authorizationHeader);
        String id = (String) claims.get(ID);
        targetReply = boardService.deleteReply(
                Integer.parseInt(postNo), Integer.parseInt(replyNo), id);
        headers.set("Access-Control-Expose-Headers", "*");
        return ResponseEntity.ok()
                .headers(headers)
                .body(targetReply);
    }

    @PutMapping("/modify_reply")
    public ResponseEntity<List<ReplyDTO>> modifyReply(
            @Validated @RequestBody ReplyDTO replyDTO,
            HttpServletRequest req) {
        HttpHeaders headers = new HttpHeaders();
        String authorizationHeader = req.getHeader(HttpHeaders.AUTHORIZATION);
        List<ReplyDTO> targetReply = null;
        Claims claims = jwtUtils.filterInternal(authorizationHeader);
        String id = (String) claims.get(ID);
        targetReply = boardService.modifyReply(replyDTO, id);
        return ResponseEntity.ok()
                .headers(headers)
                .body(targetReply);
    }
}