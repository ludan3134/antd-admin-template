# antd-admin-template
这是一个基于Antd Pro和SpringBoot开发的背景管理模板，涉及用户-角色-菜单权限，以及一些认证和ECharts的展示。在项目设计过程中，业务和功能进一步解耦，以实现解耦。对于一些常见的后台管理功能进行了实现.

## 功能特点
- **鉴权认证授权**：后端基于JWT/SpringSecurity实现的双Token方案,加强接口安全认证.前端实现按钮颗粒的级别授权.
- **扩展性强**：前后端文件的命名尽量脱离具体业务,通过路径来指示具体业务类型,达到更好的迁移复用.代码竭尽简化易懂,刨除了antdPro原始复杂不太易用的功能,使用各种经典库来简化代码的复杂程度.达到更好的维护.
- **预设应用场景**：前端的多文件上传回显,以及表单框的相互依赖/Echart统计图/后台菜单处理,路由跳转/自选icon等特性功能已经基本实现.你只需专注于对应业务,进行Copy即可.

## 安装运行
```bash
# 克隆项目
git https://github.com/ludan3134/antd-admin-template.git

# 前端
# 进入项目目录
cd front

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务# 
npm run start

# 前端
# 进入项目目录
cd server

# 本地运行
java -jar .\target\server-0.0.1-SNAPSHOT.jar
```

## 项目结构

```
# 后端项目结构

─java
│  └─rj3a
│      └─tts
│          └─server
│              ├─controller(控制层)
│              │  └─system
│              ├─entity	(实体层)
│              │  └─system
│              │      ├─request
│              │      │  └─login
│              │      └─response
│              ├─mapper
│              │  └─system
│              ├─security(安全配置)
│              │  ├─admin
│              │  ├─exception
│              │  └─filter
│              ├─service(服务层)
│              │  └─system
│              │      └─impl
│              └─uitls(工具类)
│                  ├─exception
│                  ├─json
│                  ├─jwt
│                  ├─mybatis
│                  ├─redis
│                  ├─result
│                  ├─security
│                  └─upload
└─resources
    ├─static
    └─templates

# 前端项目结构

  -config.ts (配置目录)
    defaultSettings.ts 
    oneapi.json
    proxy.ts (代理配置)
    routes.ts (路由设置)
    
    ├─pages (项目开发目录(示范))
│  │  404.tsx
│  │  Admin.tsx
│  │  
│  ├─Account
│  │  │  index.tsx (渲染组件)
│  │  │  
│  │  ├─components (挂载子组件)
│  │  │      AssignForm.tsx 
│  │  │      UpdateForm.tsx
│  │  │      
│  │  └─config (组件配置)
│  │      ├─api (相关Api)
│  │      │      getFileByUuId.tsx
│  │      │      getRoleIdByUserId.tsx
│  │      │      getUser.tsx
│  │      │      removeUser.tsx
│  │      │      uploadFile.tsx
│  │      │      upsetUser.tsx
│  │      │      upsetUserRole.tsx
│  │      │      
│  │      ├─locales (国际化)
│  │      │      en-US.tsx
│  │      │      zh-CN.tsx
│  │      │      
│  │      └─type (类型定义)
│  │              user.ts
│  │              
```

## 示例效果图
![image](https://github.com/ludan3134/iamge/blob/main/projectMockup01.png)
