// 引入 hapi-auth-jwt 插件后，所有的接口都默认开启 JWT 认证，
// 需要我们在接口调用的过程中，在 header 中添加带有 JWT 的 authorization 的字段
const config = require('../config');

const validate = (decoded, request, callback) => {
    let error;
    /*
    接口 POST /users/createJWT 中的 jwt 签发规则

    const payload = {
        userId: jwtInfo.userId,
        exp: Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60,
    };
    return JWT.sign(payload, process.env.JWT_SECRET);
  */

    // decoded 为 JWT payload 被解码后的数据
    const { userId } = decoded;
    if (!userId) {
        return callback(error, false, userId);
    }

    const credentials = {
        userId
    };
    // 在路由接口的 handler 中通过 request.auth.credentials 获取 JWT decoded 的值
    return callback(error, true, credentials);
};

module.exports = (server) => {
    server.auth.strategy('jwt', 'jwt', {
        // 需要自行在 config/index.js 中添加 jwtSecret 的配置，并且通过 process.env.JWT_SECRET 来进行 .git 版本库外的管理。
        key: config.jwtSecret,
        validateFunc: validate
    });
    server.auth.default('jwt');
};
