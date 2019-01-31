const Joi = require("joi"); // 校验数据结构
const { jwtHeaderDefine } = require('../utils/router-helper');
const GROUP_NAME = 'orders';

module.exports = [
    {
        method: 'POST',
        path: `/${GROUP_NAME}`,
        handler: (request, reply) => {
            reply();
        },
        config: {
            tags: ['api', GROUP_NAME],
            description: '创建订单',
            validate: {
                // 适用于 POST 接口的 payload（request body）验证
                payload: {
                    goodsList: Joi.array().items(
                        Joi.object().keys({
                            goods_id: Joi.number().integer(),
                            count: Joi.number().integer()
                        })
                    )
                },
                // 适用于 header 额外字段约束的 headers 验证
                ...jwtHeaderDefine
            }
        }
    },
    {
        method: 'POST',
        path: `/${GROUP_NAME}/{orderId}/pay`,
        handler: (request, reply) => {
            reply();
        },
        config: {
            tags: ['api', GROUP_NAME],
            description: '支付某条订单',
            // 动态路由所依赖的变量 orderId 以 params 属性的字段来传递，
            // orderId: Joi.string().required() 的描述，定义了 orderId 必须是字符串，且此参数必填
            // 适用于动态路由的 params 验证
            validate: {
                params: {
                    orderId: Joi.string().required() // orderId 参数为字符串 且必填
                }
            }
        }
    }
]