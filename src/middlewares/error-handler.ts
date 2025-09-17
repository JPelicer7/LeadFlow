import { ErrorRequestHandler } from "express"
import { HttpError } from "../errors/HttpError"

export const errorHandlerMiddleware: ErrorRequestHandler = (err, req, res, next) => {
    // se o erro for do tipo Http
    if(err instanceof HttpError) {
        res.status(err.status).json({message: err.message})
    }else if(err instanceof Error) { // se o erro for algo do com o JS
        res.status(500).json({message: err.message})
    }else { // para qlqer outro erro genérico
        res.status(500).json({message: "Internal Server Error"})
    }
}