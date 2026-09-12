const prisma = require("../config/database");
const databaseHealth = async(req,res) => {
    try{
        await prisma.$queryRaw`SELECT 1`;
        res.json(
            {
                success: true,
                message: "Datebase connection is working"
            }
        );
    }
    catch(error){
        console.error("Database connection error:",error);
        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }

    
};
module.exports = {databaseHealth};