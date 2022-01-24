import 'express-async-errors';
import express from 'express';
import cors from 'cors';

import { UsersController } from './controllers/UsersController';
import { TasksController } from './controllers/TasksController';
import { verifyUser } from './middlewares/auth';
import { errorHandling } from './middlewares/error';

const app = express();

const usersController = new UsersController();
const tasksController = new TasksController();

app.use(cors());
app.use(express.static('public/build'));
app.use(express.json());



app.use(verifyUser);

app.post('/signup', usersController.signUp);

app.post('/login', usersController.login);

app.get('/profile', usersController.profile);

app.get('/tasks', tasksController.findByUser);

app.post('/tasks', tasksController.create);

app.delete('/tasks/:id', tasksController.delete);

app.patch('/tasks/:id/done', tasksController.done);

app.use(errorHandling);



export {app};