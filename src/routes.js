const express = require('express');
const routes = express();
const ProfileController = require('./controllers/ProfileController');
const viewPath = __dirname + "../views/"


const Job = {
    data: [
        {
            id: 1,
            name: "Pizzaria Guloso",
            'daily-hours': 2,
            "total-hours": 1,
            createdAt: Date.now()
        },
        {
            id: 2,
            name: "Techpot",
            'daily-hours': 3,
            "total-hours": 400,
            createdAt: Date.now()
        }
    ],

    controllers: {
        index(req, res){
            // novo array
            const updatedJobs = Job.data.map((job) => {
                const remaining = Job.services.remainingDays(job)
                const status = remaining <= 0 ? 'done' : 'progress';
                
                return {
                    ...job,
                    remaining,
                    budget: Job.services.calculateBudget(job, Profile.data["value-hour"]),
                    status
                };
            })
        
            res.render(viewPath + "index", { jobs: updatedJobs })
        },

        save(req, res){
            // { name: 'ff', 'daily-hours': '3', 'total-hours': '34' } --> req.body
            const lastId = Job.data[Job.data.length - 1] ? (Job.data[Job.data.length - 1].id) : (1);
        
            Job.data.push({
                id: lastId + 1,
                name: req.body.name,
                'daily-hours': req.body["daily-hours"],
                "total-hours": req.body["total-hours"],
                createdAt: Date.now()
            })
        
            return res.redirect('/')
        },

        create(req, res){
            return res.render(viewPath + "job")
        },

        show(req, res){

            const jobId = req.params.id

            const job = Job.data.find((job) => job.id == jobId)

            if(!job){
                return res.send("404 job not found")
            }

            job.budget = Job.services.calculateBudget(job, Profile.data["value-hour"])

            return res.render(viewPath + "job-edit", {job})

        },
        
        update(req, res){
            const jobId = req.params.id

            const job = Job.data.find((job) => job.id == jobId)

            if(!job){
                return res.send("404 job not found")
            }

            const updatedJob = {
                ...job, 
                name: req.body.name,
                "total-hours": req.body["total-hours"],
                "daily-hours": req.body["daily-hours"]
            }

            Job.data = Job.data.map(job =>{

                if(Number(job.id) === Number(jobId)){
                    job = updatedJob;
                }

                return job;
            })

            return res.redirect('/job/' + jobId);

        },

        delete(req, res){
            const jobId = req.params.id;

            // retira o job de id referido na url
            Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId))

            return res.redirect('/');
        }

    },
    services: {
        remainingDays(job){
            // Calculo de tempo
            const remainingDays =  (job["total-hours"] / job["daily-hours"]).toFixed();
        
            const createdDate = new Date(job.createdAt);
            const dueDay = createdDate.getDate() + Number(remainingDays);
            const dueDateInMs = createdDate.setDate(dueDay)
            
            const timeDiffInMs = dueDateInMs - Date.now();
            // transformar milli em dias
            const dayInMs = 1000 * 60 * 60 * 24;
            const dayDiff = Math.floor(timeDiffInMs / dayInMs)
        
            // restam x dias para entrega:
            return dayDiff;
        },

        calculateBudget(job, valueHour){
            return valueHour * job["total-hours"]
        }

    }
}

// request, response
routes.get('/', Job.controllers.index);
routes.get('/job', Job.controllers.create);
//Post - Job
routes.post('/job', Job.controllers.save);
routes.get('/job/:id', Job.controllers.show);
routes.post('/job/:id', Job.controllers.update);
routes.post('/job/delete/:id', Job.controllers.delete);
routes.get('/profile', ProfileController.index);
routes.post('/profile', ProfileController.update);


module.exports = routes;