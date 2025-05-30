package com.myweb.utils;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class JwtUtils {

    private static final Dotenv dotenv = Dotenv.configure().load();
    private static final String SECRET = dotenv.get("SECRET_JWT");
    private static final long EXPIRATION_MS;

    static {
        String expirationMsStr = dotenv.get("EXPIRATION_MS");
        if (SECRET == null || expirationMsStr == null) {
            throw new IllegalStateException("Environment variables SECRET_JWT and EXPIRATION_MS must be set in .env file.");
        }
        try {
            EXPIRATION_MS = Long.parseLong(expirationMsStr);
        } catch (NumberFormatException e) {
            throw new IllegalStateException("EXPIRATION_MS must be a valid long value.");
        }
    }

    public static class TokenInfo {
        private String username;
        private List<SimpleGrantedAuthority> authorities;

        public TokenInfo(String username, List<SimpleGrantedAuthority> authorities) {
            this.username = username;
            this.authorities = authorities;
        }

        public String getUsername() {
            return username;
        }

        public List<SimpleGrantedAuthority> getAuthorities() {
            return authorities;
        }
    }

    public static String generateToken(String username, List<String> roles) throws Exception {
        JWSSigner signer = new MACSigner(SECRET);

        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(username)
                .claim("roles", roles)
                .expirationTime(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .issueTime(new Date())
                .build();

        SignedJWT signedJWT = new SignedJWT(
                new JWSHeader(JWSAlgorithm.HS256),
                claimsSet
        );

        signedJWT.sign(signer);

        return signedJWT.serialize();
    }

    public static TokenInfo validateTokenAndGetInfo(String token) throws Exception {
        SignedJWT signedJWT = SignedJWT.parse(token);
        JWSVerifier verifier = new MACVerifier(SECRET);

        if (signedJWT.verify(verifier)) {
            Date expiration = signedJWT.getJWTClaimsSet().getExpirationTime();
            if (expiration.after(new Date())) {
                String username = signedJWT.getJWTClaimsSet().getSubject();
                List<String> roles = signedJWT.getJWTClaimsSet().getStringListClaim("roles");
                List<SimpleGrantedAuthority> authorities = roles.stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());
                return new TokenInfo(username, authorities);
            }
        }
        throw new Exception("Invalid or expired token");
    }
}