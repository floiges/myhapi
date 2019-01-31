const JWT = require('jsonwebtoken');
const Joi = require('joi');
const axios = require('axios');
const config = require('../config');
const models = require('../models');
const decryptData = require('../utils/decrypted-data');

const GROUP_NAME = 'users';

module.exports = [
    {
        method: 'POST',
        path: `/${GROUP_NAME}/wxLogin`,
        handler: async (request, reply) => {
            const appid = config.wxAppId;
            const secret = config.wxSecret;
            const { code, encryptedData, iv } = request.payload;
            
            const res = await axios({
                url: 'https://api.weixin.qq.com/sns/jscode2session',
                method: 'GET',
                params: {
                    appid,
                    secret,
                    js_code: code,
                    grant_type: 'authorization_code'
                }
            });
            // res 中返回 openid 与 session_key
            const { openid, session_key: sessionKey } = res.data;
            // 基于 openid 查找用户或创建用户
            const user =  await models.users.findOrCreate({
                where: {
                    open_id: openid
                }
            });
            // decrypt 解码用户信息
            const userInfo = decryptData(encryptedData, iv, sessionKey, appid);
            // 更新user表中的用户的资料信息
            await models.users.update({
                nick_name: userInfo.nickName,
                gender: userInfo.gender,
                avatar_url: userInfo.avatarUrl,
                open_id: openid,
                session_key: sessionKey,
            }, {
                where: {
                    open_id: openid
                }
            });
            // 签发 jwt
            const generateJWT = (jwtInfo) => {
                const payload = {
                    userId: jwtInfo.userId,
                    exp: Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60,
                };
                return JWT.sign(payload, config.jwtSecret);
            };
            reply(generateJWT({
                userId: user[0].id
            }));
        },
        config: {
            tags: ['api', GROUP_NAME],
            description: '登录',
            auth: false,
            validate: {
                payload: {
                    code: Joi.string().required().description('微信用户登录的临时code'),
                    encryptedData: Joi.string().required().description('微信用户信息encryptedData'),
                    iv: Joi.string().required().description('微信用户信息iv'),
                }
            }
        }
    },
    {
        method: 'POST',
        path: `/${GROUP_NAME}/createJWT`,
        handler: async (request, reply) => {
            const generateJWT = (jwtInfo) => {
                const payload = {
                    userId: jwtInfo.userId,
                    exp: Math.floor(new Date().getTime() / 1000 + 7 * 24 * 60 * 60) // 过期时间
                };
                return JWT.sign(payload, process.env.JWT_SECRET)
            };
            reply(generateJWT({
                userId: 1
            }));
        },
        config: {
            tags: ['api', GROUP_NAME],
            description: '永远测试的用户 JWT 签发',
            auth: false // 约定此接口不参与 JWT 的用户验证，会结合下面的 hapi-auth-jwt 来使用
        }
    }
]