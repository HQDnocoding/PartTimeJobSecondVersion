/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.controllers;

import com.myweb.services.EmailService;
import java.util.Map;

import com.myweb.services.OTPService;
import com.myweb.utils.GeneralUtils;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import io.github.cdimascio.dotenv.Dotenv;
import java.util.HashMap;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author huaquangdat
 */
@RestController
@RequestMapping("/api")
public class ApiOtpController {

    @Autowired
    private EmailService emailService;
    @Autowired
    private OTPService otpService;

    private static final Dotenv dotenv = Dotenv.configure().load();

    private static final String twilioAccountSid = dotenv.get("SID_TWILLO");
    private static final String twilioAuthToken = dotenv.get("AUTH_TWILLIO");
    private static final String twilioPhoneNumber = dotenv.get("PHONE_TWLLIO");

    @PostMapping("/request-otp")
    public ResponseEntity<?> requestOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = otpService.generateOtp(email);
        String subject = "Mã OTP xác nhận email";
        emailService.sendEmail(email, subject, otp);
        return ResponseEntity.ok("OTP sent to " + email);
    }

    @PostMapping("/secure/request-otp-phone")
    public ResponseEntity<Map<String, String>> sendOtp(@RequestBody Map<String, String> request) {
        Map<String, String> response = new HashMap<>();

        String phoneNumber = request.get("phoneNumber");
        if (phoneNumber == null || phoneNumber.trim().isEmpty() || !Pattern.matches("^0[0-9]{9}$", phoneNumber)) {
            response.put("error", "Số điện thoại không hợp lệ");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        String otp = this.otpService.generateOtp(phoneNumber);

        System.out.println(String.format("%s %s %s %s", twilioAccountSid, twilioAuthToken, twilioPhoneNumber, phoneNumber));
        try {
            Twilio.init(twilioAccountSid, twilioAuthToken);
            Message.creator(
                    new PhoneNumber(GeneralUtils.convertToInternationalFormat(phoneNumber)),
                    new PhoneNumber(twilioPhoneNumber),
                    "Mã OTP của bạn là: " + otp
            ).create();

            response.put("message", "OTP đã được gửi thành công");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.put("error", "Gửi OTP thất bại: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
