package com.arcadia.perseus.filesmanager.service;

import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

import javax.xml.bind.DatatypeConverter;
import java.security.MessageDigest;

@Service
public class MD5Service implements HashService {
    @SneakyThrows
    @Override
    public String hash(byte[] data) {
        MessageDigest md = MessageDigest.getInstance("MD5");
        md.update(data);
        byte[] digest = md.digest();
        return DatatypeConverter.printHexBinary(digest);
    }
}
