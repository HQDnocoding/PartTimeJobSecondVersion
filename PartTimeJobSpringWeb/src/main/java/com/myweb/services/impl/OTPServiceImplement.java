package com.myweb.services.impl;

import com.myweb.services.OTPService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;

import java.security.SecureRandom;
import org.springframework.stereotype.Service;

@Service
public class OTPServiceImplement implements OTPService {

    @Autowired
    private CacheManager cacheManager;

    private static final int OTP_LENGTH = 6;
    private static final String CACHE_NAME = "otpCache";

    @Override
    public String generateOtp(String email) {
        String otp = generateRandomOtp();
        Cache cache = cacheManager.getCache(CACHE_NAME);
        if (cache != null) {
            cache.put(email, otp);
        }
        return otp;
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        try {
            Cache cache = cacheManager.getCache(CACHE_NAME);
            if (cache == null) {
                return false;
            }
            System.out.println("cache" + cache);
            Cache.ValueWrapper valueWrapper = cache.get(email);
            if (valueWrapper == null) {
                return false;
            }
            String storedOtp = (String) valueWrapper.get();
            return storedOtp.equals(otp);
        } catch (Exception e) {
            return false;
        }

    }

    @Override
    public void removeOTP(String email) {
        try {
            Cache cache = cacheManager.getCache(CACHE_NAME);
            cache.evict(email);
        } catch (Exception e) {

        }
    }

    @Override
    public String generateRandomOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 100_000 + random.nextInt(900_000); //100000 den 999999
        return String.valueOf(otp);
    }

    @Override
    public void clearOtp(String email) {
        Cache cache = cacheManager.getCache(CACHE_NAME);
        if (cache != null) {
            cache.evict(email);
        }
    }
}
