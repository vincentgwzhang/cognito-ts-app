```bash
# 建立 Node.js 工程（不是 Amplify 工程）
mkdir komavideo-cognito-app
cd komavideo-cognito-app
# 初始化工程
npm init -y
# 安装依赖库
npm install aws-amplify @aws-amplify/auth
npm install @aws-sdk/client-cognito-identity
npm install @aws-sdk/client-s3
# 安装 ts-node 工具
npm install --save-dev typescript ts-node @types/node
# 编写主代码
nano main.ts
...
# 执行 ts 代码
npx ts-node main.ts
```