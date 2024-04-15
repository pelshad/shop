const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        "/backend",
        createProxyMiddleware({
            target: "https://lifehim.com",
            changeOrigin: true,
        })
    );
};
