import { createContext } from "@kontext/node";
import { NextFunction, Request, Response } from "express";

const ExpressContext = createContext(({ req, res, next }) => ({ req, res, next }));

const extension = {
	provider(req: Request, res: Response, next: NextFunction) {
		ExpressContext.run({ req, res, next }, next);
	}
}

export default (Object.assign(ExpressContext, extension) as typeof ExpressContext & typeof extension);