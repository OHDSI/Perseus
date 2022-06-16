package com.softwarecountry.perseus.auth.config;

import com.azure.spring.cloud.autoconfigure.aad.AadResourceServerWebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class AadOAuth2ResourceServerSecurityConfig extends AadResourceServerWebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and()
                .authorizeRequests()
                .antMatchers("/api/info", "/api/info/").permitAll()
                .anyRequest().authenticated()
                .and()
                .oauth2ResourceServer()
                .jwt();
    }
}
