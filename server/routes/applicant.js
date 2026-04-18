import express from 'express'
import userAuth from '../middleware/userAuth.js';
import { applyJob, getApplications, getAppliedJobs, updateStatus } from '../controllers/applicant.js';

const applicantRouter = express.Router();

applicantRouter.post('/apply/:id',userAuth,applyJob)
applicantRouter.get('/applied-jobs',userAuth,getAppliedJobs)
applicantRouter.get('/applications/:id',userAuth,getApplications)
applicantRouter.put('/update/:id',userAuth,updateStatus)



export default applicantRouter;