import bcrypt from 'bcrypt';
import client from '../server';
const saltRounds = process.env.SALT_ROUNDS as string;
const pepper = process.env.BCRYPT_PASSWORD as string;

export type User = {
    id?: number;
    name: string;
    password: string;
}

export class UsersStore {
    async index(): Promise<User[]> {
        try {
            const conn = await client.connect()
            const query = `SELECT * FROM users`
            const result = await conn.query(query)
            conn.release()
            return result.rows
        }
        catch (err) {
            throw new Error(`Cannot get Users ${err}`)
        }
    }

    async show(id: string): Promise<User> {
        try {
            const conn = await client.connect()
            const query = `SELECT * FROM users WHERE id=($1)`
            const result = await conn.query(query, [id])
            conn.release()
            return result.rows[0]
        } catch (error) {
            throw new Error(`Cannot get Users ${error}`)
        }
    }

    async create(b: User): Promise<User> {
        try {
            const sql = 'INSERT INTO users (name, password) VALUES($1, $2) RETURNING *'
            const conn = await client.connect()
            if (!saltRounds) throw new Error(`Salt Not Founded`)
            const hash = bcrypt.hashSync(b.password + pepper, parseInt(saltRounds))
            const result = await conn.query(sql, [b.name, hash])
            const newUser = result.rows[0]
            conn.release()
            return newUser
        } catch (err) {
            throw new Error(`Could not add new User ${b.name}. Error: ${err}`)
        }
    }

    async update(b: User): Promise<User> {
        try {
            const sql = `UPDATE users SET name = $2, password = $3 WHERE id = $1 RETURNING *`
            const conn = await client.connect()
            if (!saltRounds) throw new Error(`Salt Not Founded`)
            const hash = bcrypt.hashSync(b.password + pepper, parseInt(saltRounds))
            const result = await conn.query(sql, [b.id, b.name, hash])
            const newUser = result.rows[0]
            conn.release()
            return newUser
        } catch (err) {
            throw new Error(`Could not add new User ${b.name}. Error: ${err}`)
        }
    }

    async remove(id: string): Promise<User> {
        try {
            const sql = 'DELETE FROM users WHERE id=($1)'
            // @ts-ignore
            const conn = await pool.connect()

            const result = await conn.query(sql, [id])
            conn.release()

            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not delete user ${id}. Error: ${err}`)
        }
    }

    async authenticate(
        name: string,
        password: string
    ): Promise<User | null> {
        try {
            const conn = await client.connect();
            const sql = "SELECT * FROM users WHERE name=($1)";
            const result = await conn.query(sql, [name]);
            if (!saltRounds) throw new Error(`Salt Not Founded`)
            if (result.rows.length) {
                const user = result.rows[0];
                if (bcrypt.compareSync(password + pepper, user.password)) {
                    conn.release();
                    return user;
                }
            }
            conn.release();
            return null;
        } catch (err) {
            throw new Error(
                `Could not authenticate user ${name}. Error: ${err}`
            );
        }
    }

}