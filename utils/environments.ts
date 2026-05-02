const env: string | undefined = process.env.NODE_ENV
const SERVE_CTX = {
    AUTH: '',
}
const configs: any = {
    // 生产环境
    production: {
     //   正式10041  开发10000  测试10000
        //正式
        // url: 'https://web.ag3434.cc',
        // imgUrl:'https://qp-prd-cdn-axdyebevbdhtasbu.a01.azurefd.net',
        // agentId:10041,
        //测试
        // url: 'https://test-web.792376.cc',
        // imgUrl:'https://qp-image-cdn-g0a2b4crg0aucxhm.a01.azurefd.net',
        // agentId:10000,
        //开发
        url: 'https://devweb.792376.cc',
        imgUrl:'https://qp-dev-cdn-g7cma9czg3gqe6ba.a01.azurefd.net',
        agentId:10000,
    },
    // 开发环境
    development: {
        url: 'https://devweb.792376.cc',
        imgUrl:'https://qp-dev-cdn-g7cma9czg3gqe6ba.a01.azurefd.net',
        agentId:10000,
    },
}

const envConfigs: {
    url: string
} = configs[env as string]

export default { envConfigs, SERVE_CTX }
