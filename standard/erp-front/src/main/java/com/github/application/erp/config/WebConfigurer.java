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
        //菜单导航栏
        registry.addViewController("/app/views/partials/sidebar.html").setViewName("views/partials/sidebar");

        registry.addViewController("/app/views/partials/offsidebar.html").setViewName("views/partials/offsidebar");
        /*设置*/
        registry.addViewController("/app/views/partials/settings.html").setViewName("views/partials/settings");

        registry.addViewController("/app/views/partials/chat.html").setViewName("views/partials/chat");
        /*底部*/
        registry.addViewController("/app/views/partials/footer.html").setViewName("views/partials/footer");

        /*主页面容器，如登陆，404等等*/
        registry.addViewController("/app/pages/page.html").setViewName("views/pages/page");
        /*锁屏页面*/
        registry.addViewController("/app/pages/lock.html").setViewName("views/pages/lock");
        /*登陆*/
        registry.addViewController("/app/pages/login.html").setViewName("views/pages/login");
        /*404*/
        registry.addViewController("/app/pages/404.html").setViewName("views/pages/404");
        /*recover*/
        registry.addViewController("/app/pages/recover.html").setViewName("views/pages/recover");
        /*注册*/
        registry.addViewController("/app/pages/register.html").setViewName("views/pages/register");

        // 首页文件
        registry.addViewController("/app/views/index.html").setViewName("views/index");


    }
}
