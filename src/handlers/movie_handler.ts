import express, { Application, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { verifyAuthToken } from "../middleware/verify_token";
import { Movie, MoviesStore } from "../models/movies";

const movies = new MoviesStore();

const index = async (req: Request, res: Response) => {
  try {
    const moviesReslults = await movies.index();
    res.json(moviesReslults);
  } catch (error) {
    res.status(400).json(error)
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const movie = await movies.show(req.params.id)
    res.json(movie)

  } catch (error) {
    res.status(400).json(error)

  }
}

const create = async (req: Request, res: Response) => {
  try {
    const movie: Movie = {
      name: req.body.name,
      releaseDate: req.body.releaseDate,
    }

    const newmovie = await movies.create(movie)
    res.json(newmovie)
  } catch (err) {
    res.status(400).json(err)
  }
}

const update = async (req: Request, res: Response) => {
  try {
    const movie: Movie = {
      id: req.body.id,
      name: req.body.name,
      releaseDate: req.body.releaseDate,
    }

    const updatedmovie = await movies.update(movie)
    res.json(updatedmovie)
  } catch (err) {
    res.status(400).json(err)
  }
}

const remove = async (req: Request, res: Response) => {
  try {
    const removedmovie = await movies.remove(req.params.id)
    res.json(removedmovie)
  } catch (err) {
    res.status(400).json(err)
  }
}


const moviesRoutes = (app: Application) => {
  app.get("/movies", verifyAuthToken, index)
  app.get('/movies/:id', verifyAuthToken, show)
  app.post('/movies', create)
  app.put('/movies', verifyAuthToken, update)
  app.delete('/movies', verifyAuthToken, remove)
};

export default moviesRoutes;
