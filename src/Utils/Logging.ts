export default class Logging{
    public static info = (args:any) => console.log(`[${new Date().toLocaleString()}] [INFO]`, args);
    public static warn = (args:any) => console.log(`[${new Date().toLocaleString()}] [WARN]`, args);
    public static error = (args:any) => console.log(`[${new Date().toLocaleString()}] [ERROR]`, args);
}