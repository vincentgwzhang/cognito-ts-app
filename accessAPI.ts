import { Amplify, Auth } from "aws-amplify";
import { CognitoUser } from "@aws-amplify/auth";

const config = {
    // 用户信息
    UID: "vincent",
    PWD: "1q2w3e4R",
    EMAIL: "vincentzhang@outlook.es",
    // 基础信息
    REGION: "eu-west-2",
    // 用户池ID
    userPoolId: "eu-west-2_lzlGbY5ZQ",
    // 用户客户端ID
    userPoolWebClientId: "6j6c87v7ecquc1cftvgiqsvl53",
};

Amplify.configure({
    Auth: {
        region: config.REGION,
        userPoolId: config.userPoolId,
        userPoolWebClientId: config.userPoolWebClientId,
        mandatorySignIn: false,
        authenticationFlowType: "USER_PASSWORD_AUTH",
    },
});

const signIn = async (username = config.UID, password = config.PWD) => {
    const user = (await Auth.signIn(username, password)) as CognitoUser;
    return user;
};

(async () => {
    // 用户登录(必须确认状态后使用)
    const user = await signIn(config.UID, config.PWD);
    // console.log(user);

    // 取得用户认证令牌
    // -> https://docs.aws.amazon.com/zh_cn/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-with-identity-providers.html
    //   ID 令牌: 包含有关经过身份验证用户的身份声明
    //   访问令牌: 主要用途是在用户池中用户的环境中授予 API 操作权限
    //   刷新令牌: 使用刷新令牌来检索新的 ID 令牌和访问令牌
    console.log(user.getSignInUserSession()?.getIdToken().getJwtToken());
})();