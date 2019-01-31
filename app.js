const Hapi = require("hapi");
const hapiAuthJWT2 = require('hapi-auth-jwt2');
require("env2")("./.env"); // 加载 .env 环境配置文件
const config = require("./config");
const routesHelloHapi = require("./routes/hello-hapi");
const routesShops = require('./routes/shops');
const routesOrders = require('./routes/orders');
const routesUsers = require('./routes/users');
const pluginHapiSwagger = require("./plugins/hapi-swagger");
const pluginHapiPagination = require("./plugins/hapi-pagination");
const pluginHapiAuthJWT2 = require('./plugins/hapi-auth-jwt2');

const server = new Hapi.Server();
server.connection({
    port: config.port,
    host: config.host
});

const init = async () => {
    await server.register([
        // 为系统使用 hapi-swagger
        ...pluginHapiSwagger,
        pluginHapiPagination,
        hapiAuthJWT2
    ]);
    // hapi-auth-jwt2 的注册使用方式与其他插件略有不同，是在插件完成 register 注册之后，
    // 通过获取 server 实例后才完成最终的配置
    pluginHapiAuthJWT2(server);
    server.route([
        // 创建一个简单的hello hapi接口
        ...routesHelloHapi,
        ...routesShops,
        ...routesOrders,
        ...routesUsers
    ]);
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
}

init();