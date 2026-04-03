import prisma from "../config/db.js"

export const applyJob = async (req, res) => {
    try {
        const userId = req.userId
        const { id } = req.params

        const job = await prisma.job.findUnique({ where: { id } })

        if (!job) {
            return res.json({
                success: false, message: "Job Not Exist"
            })
        }

        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (user.role !== "APPLICANT") {
            return res.json({
                success: false,
                message: "Only Applicant can apply for jobs"
            })
        }

        const existingApplication = await prisma.application.findUnique({
            where: { 
                jobId_userId: {
                    jobId: id,
                    userId
                }
            }
        })

        if (existingApplication) {
            return res.json({ success: false, message: "You have already applied for this job" })
        }

        const applicant = await prisma.application.create({
            data: {
                userId,
                jobId: id
            }
        })

        return res.json({
            success: true,
            message: "Successfully applied for the job"
        })

    } catch (err) {
        return res.json({
            success: false,
            message: `Internal Server Error: ${err.message}`
        })
    }
}


export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.userId;

        const applications = await prisma.application.findMany({
            where: {
                userId: userId
            },
            include: {
                job: true 
            },
            orderBy: {
                createdAt: 'desc' 
            }
        });

        if (applications.length === 0) {
            return res.json({
                success: false,
                message: "You haven't applied for any jobs yet."
            });
        }

        return res.json({
            success: true,
            applications
        });

    } catch (err) {
        return res.json({
            success: false,
            message: `Internal Server Error: ${err.message}`
        });
    }
}


export const getApplications = async (req, res) => {
    try {
        const userId=req.userId
        const {id}=req.params

        const job=await prisma.job.findUnique({
            where:{
                id                
            }
        })

        if(!job){
            return res.json({
                success:false,
                message:"Job Not Exist"
            })
        }

        if (job.userId !== userId) {
            return res.json({
                success: false,
                message: "You are not authorized to view applications for this job"
            })
        }

        const applications=await prisma.application.findMany({
            where:{
                jobId:id
            },
            include:{
                user:{
                    select:{
                        name:true,
                        email:true,
                        resume:true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc' 
            }
        })

        return res.json({
            success:true,
            applications
        })


    } catch (err) {
        return res.json({
            success: false,
            message: `Internal Server Error: ${err.message}`

        })
    }
}


export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;
        const userId = req.userId;

        if (!status) {
            return res.json({ success: false, message: "Status is required" });
        }

        const application = await prisma.application.findUnique({
            where: { id },
            include: {
                job: true 
            }
        });

        if (!application) {
            return res.json({ success: false, message: "Application not found" });
        }

        if (application.job.userId !== userId) {
            return res.json({
                success: false,
                message: "Not authorized to update this application status"
            });
        }

        const updatedApplication = await prisma.application.update({
            where: { id },
            data: { 
                status: status.toUpperCase() 
            }
        });

        return res.json({
            success: true,
            message: "Status updated successfully",
            updatedApplication
        });

    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
};