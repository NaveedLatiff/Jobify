import prisma from "../config/db.js"

export const postJob = async (req, res) => {
    try {
        const userId = req.userId
        const { title, description, location, salary, companyName, jobType } = req.body
        if (!title || !description || !location || !companyName || !jobType) {
            return res.json({
                success: false,
                message: "Please provide all the required fields"
            })
        }


        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) {
            return res.json({
                success: false,
                message: "User not found in database. Please signup again."
            })
        }
        if (user.role == "APPLICANT") {
            return res.json({
                success: false,
                message: "Only recruiters can post jobs"
            })
        }

        const job = await prisma.job.create({
            data: {
                title,
                description,
                location,
                salary,
                companyName,
                jobType,
                userId
            }
        })

        return res.json({
            success: true,
            message: "Job successfully created",
            job
        })

    } catch (err) {
        return res.json({
            success: false,
            message: `Internal Server Error: ${err.message}`
        })

    }
}

export const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.userId;
        const updateData = req.body;

        const job = await prisma.job.findUnique({
            where: { id: jobId }
        });

        if (!job) {
            return res.json({ success: false, message: "Job not found" });
        }

        if (job.userId !== userId) {
            return res.json({ success: false, message: "You are not authorized to update this job" });
        }

        const updatedJob = await prisma.job.update({
            where: { id: jobId },
            data: updateData
        });

        return res.json({
            success: true,
            message: "Job updated successfully",
            updatedJob
        });

    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
}

export const deleteJob = async (req, res) => {
    try {
        const userId = req.userId
        const { id } = req.params

        const job = await prisma.job.findUnique({
            where: {
                id
            }
        })
        if (!job) {
            return res.json
                (
                    {
                        success: false,
                        message: "Job not found"
                    }

                );
        }

        if (job.userId !== userId) {
            return res.json({ success: false, message: "You are not authorized to update this job" });
        }

        await prisma.job.delete({
            where: {
                id
            }
        })

        return res.json({
            success: true,
            message: "Job successfully deleted"
        })

    } catch (err) {
        return res.json({ success: false, message: err.message });

    }
}

export const getPostedJobs = async (req, res) => {
    try {
        const userId = req.userId

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            return res.json({
                success: false,
                message: "User Not Exist"
            })
        }

        if (user.role !== "RECRUITER") {
            return res.json({
                success: false,
                message: "Only recruiters can post jobs"
            })
        }

        const jobs = await prisma.job.findMany({
            where: {
                userId
            }
        })

        if (jobs.length == 0) {
            return res.json({
                success: false,
                message: "No Job Posted"
            })
        }

        return res.json({
            success: true,
            jobs
        })

    } catch (err) {
        return res.json({ success: false, message: err.message });

    }
}

export const getAllJobs = async (req, res) => {
    try {
        const jobs = await prisma.job.findMany({
            orderBy: {
                createdAt: 'desc' 
            }
        })

        return res.json({
            success: true,
            jobs
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

export const getSingleJob = async (req, res) => {
    try {
        const { id } = req.params; 

        const job = await prisma.job.findUnique({
            where: {
                id: id 
            }
        });

        if (!job) {
            return res.json({
                message: "Job not found.",
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            job
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

