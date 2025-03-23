import mongoose from "mongoose";

const connectToDB = async () => {
    try {
      mongoose.connection.on('connected' , ()=> console.log('Database Connected'));
      await  mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`)
    } catch (error) {
        throw new Error(error.message)
    }
}

export default connectToDB;