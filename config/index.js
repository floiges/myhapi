const env = process.env;
module.exports = {
    host: env.HOST,
    port: env.PORT,
    jwtSecret: env.JWT_SECRET,
    wxAppId: 'xxx',
    wxSecret: 'xxxx',
    wxPayApiKey: 'xxx'
}