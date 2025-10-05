import mongoose from "mongoose";

const connectDB = async () => {

//   // ✅ Clean version - no deprecated options
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('✅ MongoDB Connected'))
//   .catch((err) => console.error('❌ MongoDB connection failed:', err.message));
try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Database connected successfully')
} catch (error) {
   console.error('❌ MongoDB connection failed:', error.message)
   process.exit(1);
}
};

export default connectDB;
