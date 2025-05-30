/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.utils;

public class StringUtils {

    private StringUtils() {
        // Private constructor to prevent instantiation
    }

    public static String normalizeLocation(String location) {
        if (location == null || location.trim().isEmpty()) {
            return null;
        }
        String normalized = location.trim()
                .replaceAll("^(Thành phố|Tỉnh|Quận|Huyện)\\s*", "")
                .replaceAll("\\s+", " ");
        return normalized.substring(0, 1).toUpperCase() + normalized.substring(1).toLowerCase();
    }
}
