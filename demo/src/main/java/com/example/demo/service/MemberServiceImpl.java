package com.example.demo.service;

import com.example.demo.DTO.MemberDTO;

public interface MemberServiceImpl {

    public boolean saveMember(MemberDTO memberDTO);

    public boolean login(MemberDTO memberDTO);
}
