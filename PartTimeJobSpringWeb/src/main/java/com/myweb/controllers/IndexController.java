
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.controllers;

import com.myweb.pojo.User;
import com.myweb.services.UserService;
import java.security.Principal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 *
 * @author Hau
 */
//Khi người dùng truy cập (URL gốc), Spring sẽ gọi phương thức index trong IndexController
//Phương thức này trả về chuỗi "index", sau đó vào ThymeleafConfig tìm nơi chứa 
//Spring sẽ tìm một tệp View (index.html) để hiển thị cho người dùng.
@Controller
@ControllerAdvice
public class IndexController {

    @Autowired
    private UserService userService;

    @RequestMapping("/")
    public String index(Model model, Principal principal) {
        if (principal != null) {
            User user = userService.getUserByUsername(principal.getName());
            if (user != null) {
                model.addAttribute("currentUser", user);
                System.out.println("Username: " + user.getUsername()); // Debug
            } else {
                System.out.println("User not found for username: " + principal.getName());
            }
        } else {
            System.out.println("No user authenticated");
        }
        return "index";
    }
}
