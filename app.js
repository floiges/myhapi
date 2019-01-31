const Hapi = require("hapi");
require("env2")("./.env"); // 加载 .env 环境配置文件
const config = require("./config");
const routesHelloHapi = require("./routes/hello-hapi");
const routesShops = require('./routes/shops');
const routesOrders = require('./routes/orders');
const pluginHapiSwagger = require("./plugins/hapi-swagger");

const server = new Hapi.Server();
server.connection({
    port: config.port,
    host: config.host
});

const init = async () => {
    await server.register([
        // 为系统使用 hapi-swagger
        ...pluginHapiSwagger
    ]);
    server.route([
        // 创建一个简单的hello hapi接口
        ...routesHelloHapi,
        ...routesShops,
        ...routesOrders
    ]);
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
}

init();