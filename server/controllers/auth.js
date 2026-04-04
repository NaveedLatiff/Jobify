import prisma from '../config/db.js'
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body
        if (!name || !email || !password) {
            return res.json({
                success: false,
                message: "Please provide all the required fields"
            })
        }
        const userExist = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (userExist) {
            return res.json({
                success: false,
                message: "Email already registered"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name, email, password: hashedPassword, role
            }
        })

        const token = jwt.sign({ id: user.id }, process.env.SESSION_SECRET, { expiresIn: '7d' })

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,          
            sameSite: "none",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({
            success: true,
            message: "Successfully Signup",
            user
        })

    } catch (err) {
        return res.json({
            success: false,
            message: `Internal Server Error ${err.message}`
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.json({
                success: false,
                message: "please provide all the required fields"
            })
        }

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user.id }, process.env.SESSION_SECRET, { expiresIn: '7d' })

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.json({
            success: true,
            message: "Successfully login",
            user
        })

    } catch (err) {
        return res.json({
            success: false,
            message: `Internal Server Error ${err.message}`
        })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, password, resume } = req.body;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        let updateData = {};
        if (name) updateData.name = name;

        if (password && password.trim() !== "") {
            updateData.password = await bcrypt.hash(password, 10);
        }

        if (user.role === "APPLICANT") {
            if (resume && resume.startsWith("data:")) {
                try {
                    const uploadResponse = await cloudinary.uploader.upload(resume, {
                        folder: "user_resumes",
                        // CHANGE: Use "raw" for PDFs/Docs to avoid the /image/ link issue
                        resource_type: "raw",
                    });

                    updateData.resume = uploadResponse.secure_url;
                } catch (uploadErr) {
                    console.error("Cloudinary Error:", uploadErr);
                    return res.json({ success: false, message: "File upload failed" });
                }
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        const { password: _, ...userWithoutPassword } = updatedUser;

        return res.json({
            success: true,
            message: "Profile updated successfully",
            user: userWithoutPassword
        });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })

        return res.json({
            success: true,
            message: "Logout Successfully"
        })

    } catch (err) {
        return res.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const isAuthenticated = async (req, res) => {
    try {
        const id = req.userId;

        if (!id) {
            return res.json({
                success: false,
                message: "User Id not found"
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id
            }
        });
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        return res.json({
            success: true,
            message: "You are Authorized",
            user
        })
    } catch (err) {
        return res.json({
            success: false,
            message: `Internal Server Error: ${err.message}`
        })
    }
}