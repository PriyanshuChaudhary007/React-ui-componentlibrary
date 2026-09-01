import mongoose from "mongoose";

/* Serverless invocations reuse the same module instance, so cache the
   connection promise instead of dialing Mongo on every request. */
let connection = null;

const connectDB = async () => {
  if (connection) return connection;

  try {
    connection = mongoose.connect(process.env.MONGODB_URL);
    await connection;
    console.log("DB connected");
    return connection;
  } catch (error) {
    connection = null;
    console.log("DB error", error);
  }
};

export default connectDB;
