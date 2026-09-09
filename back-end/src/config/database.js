import mongoose from "mongoose"

const atlasHosts = [
    "ac-wkxxwjn-shard-00-00.ki4vj3w.mongodb.net:27017",
    "ac-wkxxwjn-shard-00-01.ki4vj3w.mongodb.net:27017",
    "ac-wkxxwjn-shard-00-02.ki4vj3w.mongodb.net:27017",
].join(",");

const getConnectionUri = (uri) => {
    const srvPrefix = "mongodb+srv://";
    const srvHost = "cluster0.ki4vj3w.mongodb.net";

    if (!uri?.startsWith(srvPrefix)) return uri;

    const [credentials, hostAndPath] = uri.slice(srvPrefix.length).split("@");
    if (!credentials || !hostAndPath?.startsWith(srvHost)) return uri;

    const pathAndQuery = hostAndPath.slice(srvHost.length) || "/";
    const separator = pathAndQuery.includes("?") ? "&" : "?";

    return `mongodb://${credentials}@${atlasHosts}${pathAndQuery}${separator}tls=true&authSource=admin&replicaSet=atlas-h8b9sm-shard-0&retryWrites=true&w=majority`;
};

const connectDB = async () =>{
    try {
        const uri = getConnectionUri(process.env.MONGODB_URI);
        if (!uri) throw new Error("MONGODB_URI is not set");

        const connectionInstance = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10_000 });
        console.log(`database is connected ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(`database connection failed ${error}`)
        process.exit(1)
    }
}

export default connectDB;
