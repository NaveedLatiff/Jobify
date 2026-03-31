import express from 'express'
import userAuth from '../middleware/userAuth.js';
import { deleteJob, getPostedJobs, postJob, updateJob } from '../controllers/job.js';

const jobRouter = express.Router();

jobRouter.post('/post-job',userAuth,postJob)
jobRouter.put('/update-job/:id',userAuth,updateJob)
jobRouter.delete('/delete-job/:id',userAuth,deleteJob)
jobRouter.get('/get-jobs',userAuth,getPostedJobs)




export default jobRouter;