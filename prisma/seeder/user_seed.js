const { Role } = require("@prisma/client");
const bcrypt = require("bcrypt");

async function userAdmin(prisma) {
    try {

        const encryptedPassword = await bcrypt.hash("rahasiaAdmin", 10);
        await prisma.user.create({
            data: {
                fullname: "FlyNow Foundation Admin",
                email: "flynowb6@gmail.com",
                phoneNumber: "08123456789",
                password: encryptedPassword,
                isVerified: true,
                role: Role.admin

            },
        });
        console.log('admin data seeded successfully');
    } catch (error) {
        console.log(error)
    }
}

module.exports = userAdmin