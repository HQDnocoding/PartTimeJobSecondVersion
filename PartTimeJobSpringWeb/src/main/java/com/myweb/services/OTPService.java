/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.services;

/**
 *
 * @author huaquangdat
 */
public interface OTPService {

    String generateOtp(String email);

    boolean verifyOtp(String email, String otp);

    String generateRandomOtp();

    void clearOtp(String email);

    void removeOTP (String email);
    
}
