import express from 'express'
import { connectionDB } from './Database/ConnectionDB.js'
import { bootstrap } from './src/bootstrap.js'
import dotenv from 'dotenv'
import { globalError } from './src/middleware/globalErrorMiddleware.js'
import schedule from'node-schedule'
import { sendEmail } from './src/utils/email.js'
import { userModel } from './Database/models/User.model.js'

const app = express()
const port = process.env.PORT || 5000
app.use(express.json())
dotenv.config()

bootstrap(app)
connectionDB()
app.use(globalError)

// send email every day at 9PM to users not confirm their eamil
schedule.scheduleJob('0 0 21 * * *', async function(){
  const notConfrim = await userModel.find({confirmEmail: false}).select('email')
  sendEmail(notConfrim, "Please confirm your email", "confirm your email now or your account will delete")
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

