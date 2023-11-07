const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/users", // 이 부분을 변경하고 싶은 경로로 수정
    createProxyMiddleware({
      target: "http://localhost:8080", // API 서버 주소
      changeOrigin: true,
    })
  );

  app.use(
    "/documents", // 다른 경로도 필요한 경우 이와 같이 추가
    createProxyMiddleware({
      target: "http://localhost:8080", // API 서버 주소
      changeOrigin: true,
    })
  );
  app.use(
    "/versions", // 다른 경로도 필요한 경우 이와 같이 추가
    createProxyMiddleware({
      target: "http://localhost:8080", // API 서버 주소
      changeOrigin: true,
    })
  );
  app.use(
    "/auth",
    createProxyMiddleware({
      target: "http://localhost:8080",
      changeOrigin: true,
    })
  );
  app.use(
    "/s3-images",
    createProxyMiddleware({
      target: "https://dowonbucket.s3.ap-northeast-2.amazonaws.com",
      changeOrigin: true,
    })
  );
};
