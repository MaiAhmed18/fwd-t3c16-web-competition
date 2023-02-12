import bcrypt from 'bcrypt';
import client from '../server';

export type Movie = {
    id?: number;
    name: string;
    releaseDate: string;
}

export class MoviesStore {
    async index(): Promise<Movie[]> {
        try {
            const conn = await client.connect()
            const query = `SELECT * FROM movies`
            const result = await conn.query(query)
            conn.release()
            return result.rows
        }
        catch (err) {
            throw new Error(`Cannot get movies ${err}`)
        }
    }

    async show(id: string): Promise<Movie> {
        try {
            const conn = await client.connect()
            const query = `SELECT * FROM movies WHERE id=($1)`
            const result = await conn.query(query, [id])
            conn.release()
            return result.rows[0]
        } catch (error) {
            throw new Error(`Cannot get movies ${error}`)
        }
    }

    async create(b: Movie): Promise<Movie> {
        try {
            const sql = 'INSERT INTO movies (name, release_date) VALUES($1, $2) RETURNING *'
            const conn = await client.connect()
            const result = await conn.query(sql, [b.name, b.releaseDate])
            const newmovie = result.rows[0]
            conn.release()
            return newmovie
        } catch (err) {
            throw new Error(`Could not add new movie ${b.name}. Error: ${err}`)
        }
    }

    async update(b: Movie): Promise<Movie> {
        try {
            const sql = `UPDATE movies SET name = $2, release_date = $3 WHERE id = $1 RETURNING *`
            const conn = await client.connect()
            const result = await conn.query(sql, [b.id, b.name, b.releaseDate])
            const newmovie = result.rows[0]
            conn.release()
            return newmovie
        } catch (err) {
            throw new Error(`Could not add new movie ${b.name}. Error: ${err}`)
        }
    }

    async remove(id: string): Promise<Movie> {
        try {
            const sql = 'DELETE FROM movies WHERE id=($1)'
            // @ts-ignore
            const conn = await pool.connect()

            const result = await conn.query(sql, [id])
            conn.release()

            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not delete movie ${id}. Error: ${err}`)
        }
    }

}