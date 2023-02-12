import express, { Application, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { verifyAuthToken } from "../middleware/verify_token";
import { User, UsersStore } from "../models/users";

const users = new UsersStore();

const index = async (req: Request, res: Response) => {
  try {
    const usersReslults = await users.index();
    res.json(usersReslults);
  } catch (error) {
    res.status(400).json(error)
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const user = await users.show(req.params.id)
    res.json(user)

  } catch (error) {
    res.status(400).json(error)

  }
}

const create = async (req: Request, res: Response) => {
  try {
    const user: User = {
      name: req.body.name,
      password: req.body.password,
    }

    const newuser = await users.create(user)
    let token = jwt.sign({ newuser }, process.env.TOKEN_SECRET as string)
    res.json({ token: token })
  } catch (err) {
    res.status(400).json(err)
  }
}

const update = async (req: Request, res: Response) => {
  try {
    const user: User = {
      id: req.body.id,
      name: req.body.name,
      password: req.body.password,
    }

    const updatedUser = await users.update(user)
    let token = jwt.sign({ updatedUser }, process.env.TOKEN_SECRET as string)
    res.json({ token: token })
  } catch (err) {
    res.status(400).json(err)
  }
}

const remove = async (req: Request, res: Response) => {
  try {
    const removedUser = await users.remove(req.params.id)
    res.json(removedUser)
  } catch (err) {
    res.status(400).json(err)
  }
}

const authenticate = async (req: Request, res: Response) => {
  try {
    let name = req.body.name
    let password = req.body.password

    const newuser = await users.authenticate(name, password);

    let token = jwt.sign({ newuser }, process.env.TOKEN_SECRET as string)
    res.json({ token: token })

  } catch (error) {
    res.status(400).json(error)

  }
}

const usersRoutes = (app: Application) => {
  app.get("/users", verifyAuthToken, index)
  app.get('/users/:id', verifyAuthToken, show)
  app.post('/users', create)
  app.put('/users', verifyAuthToken, update)
  app.delete('/users',verifyAuthToken,remove)
  app.post('/users/authenticate', authenticate)
};

export default usersRoutes;
