package com.example.demo.service;

import com.example.demo.DTO.MemberDTO;

public interface MemberServiceImpl {

    public boolean saveMember(MemberDTO memberDTO);

    public MemberDTO login(MemberDTO memberDTO);
}
