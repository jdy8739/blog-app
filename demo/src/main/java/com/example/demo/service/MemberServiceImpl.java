package com.example.demo.service;

import com.example.demo.DTO.MemberDTO;

public interface MemberServiceImpl {
    public void saveMember(MemberDTO memberDTO);

    public boolean login(MemberDTO memberDTO);
}
