import { createContext } from "@kontext/node";
import { RequestHandler } from "express";

export default function createExpressContext<THook extends (params: any) => any>(hook: THook) {
	const CTX = createContext(hook);

	const extension = {
		provider(params: Parameters<THook>[0]) {
			const handler: RequestHandler = (req, res, next) => {
				CTX.run(params, next)
			}

			return handler;
		}
	}

	return Object.assign(CTX, extension) as typeof CTX & typeof extension;
}