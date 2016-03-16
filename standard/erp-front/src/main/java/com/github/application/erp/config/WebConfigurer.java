package com.github.application.erp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * Created by lenovo on 2016/1/21.
 */
@Configuration
public class WebConfigurer extends WebMvcConfigurerAdapter {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addRedirectViewController("/","index.html");
        registry.addViewController("/index.html").setViewName("index");

        // 布局文件
        registry.addViewController("/app/views/app.html").setViewName("views/app");
        //头部文件
        registry.addViewController("/app/views/partials/top-navbar.html").setViewName("views/partials/top-navbar");
        //头部文件
        registry.addViewController("/app/views/partials/sidebar.html").setViewName("views/partials/sidebar");
        // 首页文件
        registry.addViewController("/app/views/index.html").setViewName("views/index");


    }
}
