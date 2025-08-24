import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase', {})
        console.log(`mongoose connected`)
    } catch (err) {
        console.error("Error connecting the DB", err)
        process.exit(1)
    }
}