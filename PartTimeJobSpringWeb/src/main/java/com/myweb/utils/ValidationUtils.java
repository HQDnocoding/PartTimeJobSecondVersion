package com.myweb.utils;

public class ValidationUtils {

    public static boolean isValidPassword(String password) {
        if (password == null) return false;

        // Tối thiểu 8 ký tự, ít nhất 1 chữ thường, 1 chữ hoa, 1 chữ số
        String regex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$";
        return password.matches(regex);
    }

    public static boolean isValidUsername(String username) {
        if (username == null) return false;

        // Kiểm tra độ dài, không có khoảng trắng, và không bắt đầu bằng số/ký tự đặc biệt
        String regex = "^[a-zA-Z][a-zA-Z0-9_]{7,}$";  // bắt đầu bằng chữ cái, tổng cộng ít nhất 8 ký tự
        return username.matches(regex);
    }

}
