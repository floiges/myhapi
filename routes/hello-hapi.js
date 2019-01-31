module.exports = [
    {
        method: "GET",
        path: "/",
        handler: (request, reply) => {
            reply("hello hapi");
        },
        config: {
            // Swagger 标记
            tags: ['api', 'tests'],
            description: '测试hello-api'
        }
    }
]