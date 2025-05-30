package com.myweb.formatters;

import com.myweb.pojo.User;
import org.springframework.format.Formatter;

import java.text.ParseException;
import java.util.Locale;

public class UserFormatter implements Formatter<User> {
    @Override
    public User parse(String userId, Locale locale) throws ParseException {
        User user = new User();
        user.setId(Integer.valueOf(userId));
        return user;
    }

    @Override
    public String print(User user, Locale locale) {
        return String.valueOf(user.getId());
    }


}
