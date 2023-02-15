// https://aws-amplify.github.io/amplify-js/api/
import { Amplify, Auth } from "aws-amplify";

// https://www.npmjs.com/package/amazon-cognito-identity-js
import { CognitoUser } from "@aws-amplify/auth";

const config = {
    // 用户信息
    UID: "vincentgwzhangbackup01",
    PWD: "Aa12345678!",
    EMAIL: "vincentgwzhangbackup01@gmail.com",
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

// 用户登录
const signIn = async (username = config.UID, password = config.PWD) => {
    const user = (await Auth.signIn(username, password)) as CognitoUser;
    return user;
};

/*
// 强制改变口令
aws cognito-idp admin-set-user-password \
    --user-pool-id "eu-west-2_lzlGbY5ZQ" \
    --username "vincent" \
    --password '1q2w3e4R' \
    --permanent \
    --region "eu-west-2"
*/
(async () => {
    // 用户登录(必须确认状态后使用)
    const user = await signIn();
    // 确认取得的用户信息令牌
    console.log(user);
})();