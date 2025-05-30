/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.controllers;

import com.fasterxml.jackson.databind.ser.FilterProvider;
import com.fasterxml.jackson.databind.ser.impl.SimpleBeanPropertyFilter;
import com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.myweb.exeption.AuthenticationException;
import com.myweb.pojo.Candidate;
import com.myweb.pojo.User;
import com.myweb.services.CandidateService;
import com.myweb.services.UserService;
import com.myweb.utils.GeneralUtils;
import com.myweb.utils.JwtUtils;
import io.github.cdimascio.dotenv.Dotenv;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.json.MappingJacksonValue;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.*;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author huaquangdat
 */
@RestController
@RequestMapping("/api")
public class ApiUserController {

    @Autowired
    private UserService userService;
    @Autowired
    private CandidateService candidateService;

    private static final SimpleBeanPropertyFilter USER_FILTER
            = SimpleBeanPropertyFilter.serializeAllExcept("password", "isActive", "registerDate");

    private static final String GOOGLE_CLIENT_ID = Dotenv.configure().load().get("GOOGLE_CLIENT_ID");

    @DeleteMapping("/admin/users/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable(value = "userId") int userId) {
        this.userService.deleteUser(userId);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User u) {
        try {
            System.out.println(String.format("username %s pw %s", u.getUsername(), u.getClientPassword()));
            // Xác thực người dùng
            User user = userService.authenticate(u.getUsername(), u.getClientPassword());

            String token = JwtUtils.generateToken(user.getUsername(), List.of(user.getRole()));

            return ResponseEntity.ok().body(Collections.singletonMap("token", token));

        } catch (AuthenticationException e) {
            // Xử lý lỗi xác thực
            if (e.getMessage().equals("Tài khoản tuyển dụng chưa được xét duyệt") || e.getMessage().equals("Tài khoản này không được phép đăng nhập ở đây.")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error",  e.getMessage()));
        }
    }

    @RequestMapping("/secure/profile")
    @ResponseBody
    @CrossOrigin
    public ResponseEntity<?> getProfile(Principal principal) {
        User user = this.userService.getUserByUsername(principal.getName());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        MappingJacksonValue mapping = new MappingJacksonValue(user);
        FilterProvider filters = new SimpleFilterProvider().addFilter("UserFilter", USER_FILTER);
        mapping.setFilters(filters);

        System.out.println("User fetched: " + user);
        return ResponseEntity.ok(mapping);
    }

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> payload) {
        try {
            String idToken = payload.get("idToken");
            if (idToken == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "ID token is required"));
            }

            // Xác minh ID token từ Google
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(GOOGLE_CLIENT_ID))
                    .build();

            GoogleIdToken googleIdToken = verifier.verify(idToken);
            if (googleIdToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid Google ID token"));
            }

            GoogleIdToken.Payload tokenPayload = googleIdToken.getPayload();
            String email = tokenPayload.getEmail();
            String name = String.valueOf(tokenPayload.get("name"));
            String avatar = String.valueOf(tokenPayload.get("picture"));

            payload.put("email", email);
            payload.put("name", name);
            payload.put("avatar", avatar);

            System.out.println("tokenPayLoad " + tokenPayload);

            // Kiểm tra người dùng
            System.out.println(email);
            User user = userService.getUserByUsername(email);
            System.out.println("user" + user);
            if (user != null) {
                if (user.getCandidate() == null) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(Map.of("error", "User exists without Candidate"));
                }
                // Người dùng đã có Candidate, cấp token
                String token = JwtUtils.generateToken(user.getUsername(), List.of(user.getRole()));
                return ResponseEntity.ok().body(Collections.singletonMap("token", token));
            }
            // Lưu User và Candidate
            user = this.candidateService.createCandidateByGoogleAccount(payload);
            System.out.println("user2" + user);

            String token = JwtUtils.generateToken(user.getUsername(), List.of(user.getRole()));
            return ResponseEntity.ok().body(Collections.singletonMap("token", token));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi hệ thống: " + e.getMessage()));
        }
    }

}
