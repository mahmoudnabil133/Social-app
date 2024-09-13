const redis = require('redis');
const {promisify} = require('util');

class RedisClient {
    constructor(){
        this.client = redis.createClient();
        this.client.on('connect', ()=>{
            console.log('Redis connected');
        });
        this.client.on('error', (err)=>{
            console.log(`Redis connection failed: ${err}`);
        });
        this.getAsync = promisify(this.client.get).bind(this.client);
        // this.connect();
    }
    async connect(){
        try{
            await this.client.connect();
        }catch(err){
            console.log(err);
        }
    }
    async get(key){
        try{
            const value = await this.getAsync(key);
            return value;
        }catch(err){
            console.log(err);
            return null;
        }
    };
    async set(key, value, duration){
        try{
            this.client.set(key, value, 'EX', duration);
        }catch(err){
            console.log(err);
        }
    };
    async del(key){
        try{
            this.client.del(key);
        }catch(err){
            console.log(err);
        }
    }
}
const redisClient = new RedisClient();
module.exports = redisClient;

// const main = async()=>{
//     try{
//         console.log('setting name');
//         await redisClient.set('app', 11, 111)
//         const name = await redisClient.get('app');
//         console.log(name);
//     }catch(err){
//         console.log(err);
//     }
// }
// main();
