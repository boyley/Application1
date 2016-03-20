package com.github.application.erp.config;

import com.github.application.erp.security.*;
import com.github.application.erp.web.filter.CsrfCookieGeneratorFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.data.repository.query.SecurityEvaluationContextExtension;
import org.springframework.security.web.csrf.CsrfFilter;

/**
 * Created by lenovo on 2016/3/20.
 */
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    private AjaxAuthenticationSuccessHandler ajaxAuthenticationSuccessHandler;

    @Autowired
    private AjaxAuthenticationFailureHandler ajaxAuthenticationFailureHandler;

    @Autowired
    private AjaxLogoutSuccessHandler ajaxLogoutSuccessHandler;

    @Autowired
    private Http401UnauthorizedEntryPoint authenticationEntryPoint;

//    @Autowired
//    private RememberMeServices rememberMeServices;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                .anyRequest()
                .authenticated()
                .and()
                .csrf()
                .and()
                .addFilterAfter(new CsrfCookieGeneratorFilter(), CsrfFilter.class)
                .exceptionHandling()
                .accessDeniedHandler(new CustomAccessDeniedHandler())
                .authenticationEntryPoint(authenticationEntryPoint)
//                .and()
//                .rememberMe()
//                .rememberMeServices(rememberMeServices)
//                .rememberMeParameter("remember-me")
                .and()
                .formLogin()
                .loginProcessingUrl("/api/authentication")
                .successHandler(ajaxAuthenticationSuccessHandler)
                .failureHandler(ajaxAuthenticationFailureHandler)
                .usernameParameter("j_username")
                .passwordParameter("j_password")
                .permitAll()
                .and()
                .logout()
                .logoutUrl("/api/logout")
                .logoutSuccessHandler(ajaxLogoutSuccessHandler)
                .deleteCookies("JSESSIONID", "CSRF-TOKEN")
                .permitAll()
                .and()
                .headers()
                .frameOptions()
                .disable();

    }

    @Bean
    public SecurityEvaluationContextExtension securityEvaluationContextExtension() {
        return new SecurityEvaluationContextExtension();
    }
}
