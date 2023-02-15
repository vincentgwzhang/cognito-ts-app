import { Amplify, Auth } from "aws-amplify";
import { CognitoUser } from "@aws-amplify/auth";

const config = {
    // 用户信息
    UID: "vincentgwzhangbackup02",
    PWD: "Aa12345678!",
    EMAIL: "vincentgwzhangbackup02@gmail.com",
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

// 用户注册
const signUp = async (username: string, password: string) => {
    const user = await Auth.signUp({
        username,
        password,
        attributes: {
            email: config.EMAIL,
        },
    });
    return user;
};

// 用户注册校验
const confirmSignUp = async (username: string, verification_code: string) => {
    try {
        // 确认邮件校验码
        const result = await Auth.confirmSignUp(username, verification_code);
        console.log(result);
    } catch (error) {
        console.log("error confirming sign up", error);
    }
};

(async () => {
    // 1, 用户注册
    // const user = await signUp(config.UID, config.PWD);
    
    
    // 2, 邮件确认校验码
    // await confirmSignUp("vincent", "362944");
    
    
    // 3, 新用户登录
    // const user = await signIn(config.UID, config.PWD);
    // console.log(user);
})();