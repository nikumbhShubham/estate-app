import bcryptjs from 'bcryptjs'
import prisma from '../lib/prisma.js'
import jwt from 'jsonwebtoken'


export const register = async (request, response) => {
    const { username, password, email } = request.body
    try {
        //****HASH THE PASSWORD */
        const hashedPassword = bcryptjs.hashSync(password, 10)

        //****CREATE A NEW USER TO SAVE TO DB */

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });
        response.status(201).json(newUser)
    } catch (error) {
        console.log(error)
        response.status(500).json({ msg: "Failed to create user" })
    }
}
export const login = async (request, response) => {
    const { username, password } = request.body;

    console.log('Login request received:', request.body);

    try {
        // CHECK IF USER EXISTS
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            console.log('User not found:', username);
            return response.status(401).json({ msg: "Invalid credentials" });
        }

        // CHECK IF PASSWORD IS CORRECT
        console.log('User password from DB:', user.password);

        const isPasswordCorrect = bcryptjs.compareSync(password, user.password);
        if (!isPasswordCorrect) {
            console.log('Password mismatch for user:', username);
            return response.status(401).json({ msg: "Invalid credentials" });
        }

        // GENERATE COOKIE TOKEN AND SEND TO THE USER
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        const expiryDate = new Date(Date.now() + 3600000); // 1 hour

            const {password:userpassword, ...userinfo}=user

        response.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
            .status(200)
            .json(userinfo);

    } catch (error) {
        console.error('Error during login:', error);
        response.status(500).json({ msg: "Failed to login" });
    }
};

export const logout = (request, response) => {
    response.clearCookie('access_token').status(200).json("signout success...")

}