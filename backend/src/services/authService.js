const bcrypt = require("bcryptjs");
const prisma = require("../config/database");

const registerUser = async ({ name, email, password, role }) => {
    const existingUser = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (existingUser) {
        const error = new Error("User already exists");
        error.statusCode = 409;
        throw error;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            passwordHash,
            role: role || "EMPLOYEE"
        }
    });

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };
};

module.exports = {
    registerUser
};