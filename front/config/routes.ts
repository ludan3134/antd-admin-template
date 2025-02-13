﻿/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  // 1.登录路由
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },
  // 2.重定向跳转首页路由
  {
    path: '/',
    access: 'getHome', // 会调用 src/access.ts 中返回的 normalRouteFilter 进行鉴权
    redirect: '/welcome',
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
    hideInMenu: false,
    layout: {
      hideMenu: false,
      hideNav: false,
      hideFooter: false,
    }
  },
  // 3.重定向至报错页面
  {
    path: '*',
    layout: false,
    component: './404',
  },
  // 4.系统管理页面
  {
    path: '/System',
    name: 'System',
    routes: [
      {
        path: '/System/menu',
        component: './Menu',
      },
      {
        path: '/System/role',
        component: './Role',
      },
      {
        path: '/System/user',
        component: './Account',
      },
    ],
  },
  //  5.直播业务
  {
    path: '/Live',
    name: 'Live',
    routes: [
      {
        path: '/Live/category',
        name: 'category',
        routes: [
          {
            path: '/Live/category',
            redirect: 'cat1',
          },
          {
            name: 'cat1',
            path: '/Live/category/cat1',
            routes: [
              {
                path: '/Live/category/cat1',
                component: './live/category/cat1',
              },
              {
                name: 'cat2',
                path: 'cat2',
                routes: [
                  {
                    path: '/Live/category/cat1/cat2',
                    component: './live/category/cat2',
                  },
                  {
                    path: 'cat3',
                    component: './live/category/cat3',
                  },
                ]
              },

            ]
          },
        ]
      },
      {
        path: '/Live/monitor',
        name: 'monitor',
        routes: [
          {
            path: '/Live/monitor',
            redirect: 'logRecord',
          },
          {
            name: 'logRecord',
            path: '/Live/monitor/logRecord',
            routes: [
              {
                path: "/Live/monitor/logRecord",
                component: './live/monitor/logRecord',
              },
              {
                name: 'image',
                path: "image",
                component: "./live/monitor/imageList"
              }
            ]
          }
        ],
      },
    ],
  },
//   6 面板
  {
    path: '/dashboard',
    name: "Dashboard",
    routes: [
      {
        path: '/dashboard',
        redirect: 'analysis',
      },
      {
        name: 'analysis',
        path: '/dashboard/analysis',
        component: './dashboard/analysis',
      },
    ],
  },
];

//
