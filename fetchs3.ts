import { Amplify, Auth } from "aws-amplify";
import { CognitoUser } from "@aws-amplify/auth";
import {
    CognitoIdentityClient,
    GetIdCommand,
    GetIdCommandInput,
    GetCredentialsForIdentityCommand,
    GetCredentialsForIdentityCommandInput,
} from "@aws-sdk/client-cognito-identity";
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

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

    IdentityPoolId: "eu-west-2:7314248a-cd29-4130-9d49-a044058a7998",
};

// 身份池URL
const congitoIdentityPool = `cognito-idp.${config.REGION}.amazonaws.com/${config.userPoolId}`;

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

const getSTS = async () => {
    // ## 身份池验证流程 ★★★
    // https://docs.aws.amazon.com/zh_cn/cognito/latest/developerguide/authentication-flow.html

    const user = signIn();

    const client = new CognitoIdentityClient({ region: config.REGION });
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cognito-identity/interfaces/getidcommandinput.html

    const params1: GetIdCommandInput = {
        /** input parameters */
        IdentityPoolId: config.IdentityPoolId,
        Logins: {
            [congitoIdentityPool]: (await user).getSignInUserSession()!.getIdToken().getJwtToken(),
        },
    };
    // 增强型（简化的）身份验证流程: GetId
    const command1 = new GetIdCommand(params1);
    const response1 = await client.send(command1);
    // console.log(response1);

    // 增强型（简化的）身份验证流程: GetCredentialsForIdentity
    const params2: GetCredentialsForIdentityCommandInput = {
        IdentityId: response1.IdentityId,
        Logins: {
            [congitoIdentityPool]: (await user).getSignInUserSession()!.getIdToken().getJwtToken(),
        },
    };
    const command2 = new GetCredentialsForIdentityCommand(params2);
    const response2 = await client.send(command2);
    return response2.Credentials;
};

const listS3Buckets = async (p_credentials: any) => {
    if (p_credentials) {
        const client = new S3Client({
            region: config.REGION,
            credentials: {
                accessKeyId: p_credentials.AccessKeyId!,
                secretAccessKey: p_credentials.SecretKey!,
                sessionToken: p_credentials.SessionToken,
            },
        });
        const params = {};
        const command = new ListBucketsCommand(params);
        const response = await client.send(command);
        console.log(response);
    }
};

(async () => {
    // 用户登录，取得临时安全凭证
    const p_credentials = await getSTS();
    // console.log(p_credentials);

    // 使用临时安全凭证列出 S3 存储桶
    await listS3Buckets(p_credentials);
})();