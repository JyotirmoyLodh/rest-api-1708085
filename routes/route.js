const express = require('express');
const app = express();

// Express route
const todoRoute = express.Router();

// User schema
let todoSchema = require('../model/todo');

// Get users
todoRoute.route('/list').get((req, res) => {
    todoSchema.find((error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

// Create user
todoRoute.route('/add').post((req, res, next) => {
    // todoSchema.ensureIndexes({created_at: req.body.created_at },{expireAfterSeconds: (req.body.duration*60)}, (error, data) => {
    //     if (error) {
    //         return next(error)
    //     } else {
    //         res.json(data)
    //     }
    // }),
    ttl(req.body.duration, req.body),
        todoSchema.create(req.body, (error, data) => {
            if (error) {
                return next(error)
            } else {
                res.json(data)
            }
        })
    //ttl(req.body.duration,todoSchema.aggregate([ { $minute: "$date" }]))
});

// Delete student
todoRoute.route('/remove/:id').delete((req, res, next) => {
    todoSchema.findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

function ttl(a, b) {
    var duration = a;
    var hour = Number(b.createdAt.substring(11, 13));
    var minute = Number(b.createdAt.substring(14, 16));
    var seconds = Number(b.createdAt.substring(17, 19));
    console.log(duration, hour, minute, seconds);
    var cron = require('node-cron');
    var count = 0;
    var pattern = dur(duration, b);
    var v1 = 1;
    var v2 = 2;
    var t = v1 + ' ' + v2;
    var job = t + ' * * * *';
    var task = cron.schedule(pattern, () => {
        console.log('will execute every minute until stopped', count);
        count++;
        todoSchema.findOneAndRemove({createdAt: b.createdAt }, function (err, docs) { 
            if (err){ 
                console.log(err) 
            } 
            else{ 
                console.log("Removed User : ", docs); 
            } 
        })
        v(count);
    });
    console.log(pattern)
    function v(c) {
        if (c > 0) {
            task.stop();
        }
    }
}

function dur(duration, b) {
    var minute = Number(b.createdAt.substring(14, 16));
    var hour = Number(b.createdAt.substring(11, 13));
    var date = Number(b.createdAt.substring(8, 10));
    var month = Number(b.createdAt.substring(5, 7));
    var new_minuite = Number(minute);
    var new_hour = Number(hour);
    var new_date = Number(date);
    var new_month = Number(month);
    console.log(duration, new_minuite, new_hour, new_date, new_month);
    new_minuite = new_minuite + Number(duration);
    //console.log(new_minuite)
    //new_minuite=Math.trunc(new_minuite%60);
    //new_hour=Math.trunc((duration/60)%24);
    if (new_minuite > 59) {
        new_hour = new_hour + Math.trunc(new_minuite/60);
        new_minuite = new_minuite - 60;
        if (new_hour > 23) {
            new_date = new_date + Math.trunc(new_hour/24);
            new_hour = new_hour - 24;
            if ((new_date > 31) && ((new_month == 1) || (new_month == 3) || (new_month == 5) || (new_month == 7) || (new_month == 8) || (new_month == 10) || (new_month == 12))) {
                new_date = new_date - 31;
                new_month = new_month + 1;
                if (new_month > 12) {
                    new_month = 01;
                }
            }
            else if ((new_date > 30) && ((new_month == 2) || (new_month == 4) || (new_month == 6) || (new_month == 9) || (new_month == 11))) {
                new_date = new_date - 30;
                new_month = new_month + 1;
                if (new_month > 12) {
                    new_month = 01;
                }
            }
        }
    }
    var pattern = new_minuite + ' ' + new_hour + ' ' + new_date + ' ' + new_month + ' *';
    console.log(pattern);
    return pattern;
}

module.exports = todoRoute;