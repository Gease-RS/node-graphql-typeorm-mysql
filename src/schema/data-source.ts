import 'dotenv/config'
import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Users } from '../Entities/Users'

//import '../config'

const port = process.env.DB_PORT as number | undefined

export const AppDataSource = new DataSource({
	type: 'mysql',
	host: process.env.DB_HOST,
	port: port,
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	entities: [Users],
    synchronize: false,
    ssl: false
})