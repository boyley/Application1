package com.github.application.erp.web.rest;

import com.github.application.erp.web.dto.UserDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by Bogle on 2016/3/22.
 */
@RestController
@RequestMapping("/api")
public class AccountResource {

    /**
     * GET  /account -> get the current user.
     */
    @RequestMapping(value = "/account",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserDTO> getAccount() {
        System.out.println("getAccount");
        return new ResponseEntity(HttpStatus.OK);
    }
}
