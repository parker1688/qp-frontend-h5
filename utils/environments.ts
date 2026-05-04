const env: string | undefined = process.env.NODE_ENV
const SERVE_CTX = {
    AUTH: '',
}
const configs: any = {
    // 生产环境
    production: {
        url: 'http://165.154.110.60',
        imgUrl: 'http://165.154.110.60',
        agentId: 10000,
    },
    // 开发环境（本地开发时使用）
    development: {
        url: 'http://localhost:10072',
        imgUrl: 'http://localhost:10072',
        agentId: 10000,
    },
}

const envConfigs: {
    url: string
} = configs[env as string]

export default { envConfigs, SERVE_CTX }