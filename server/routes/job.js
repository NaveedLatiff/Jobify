import express from 'express'
import userAuth from '../middleware/userAuth.js';
import { deleteJob, getAllJobs, getPostedJobs, getSingleJob, postJob, updateJob } from '../controllers/job.js';

const jobRouter = express.Router();

jobRouter.get('/all-jobs',getAllJobs)
jobRouter.get('/get-posted-jobs',userAuth,getPostedJobs)
jobRouter.get('/:id',getSingleJob)

jobRouter.post('/post-job',userAuth,postJob)
jobRouter.put('/update-job/:id',userAuth,updateJob)
jobRouter.delete('/delete-job/:id',userAuth,deleteJob)




export default jobRouter;