package com.example.demo.service;

import com.example.demo.DTO.MemberDTO;

public interface MemberService {

    public boolean saveMember(MemberDTO memberDTO);

    public MemberDTO login(MemberDTO memberDTO);

    public void addLike(String id, Integer postNo);

    public void cancelLike(String id, Integer postNo);
}
