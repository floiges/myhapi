const { jwtHeaderDefine } = require('../utils/router-helper');
module.exports = [
    {
        method: "GET",
        path: "/",
        handler: (request, reply) => {
            /*
            plugins/hapi-auth-jwt2.js 中的 credentials 定义

            const credentials = {
                userId,
            };
            */
            console.log(request.auth.credentials);
            reply('hello hapi');
        },
        config: {
            // Swagger 标记
            tags: ['api', 'tests'],
            description: '测试hello-api',
            validate: {
                ...jwtHeaderDefine
            }
        }
    }
]