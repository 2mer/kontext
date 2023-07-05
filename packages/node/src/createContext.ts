import { AsyncLocalStorage } from 'async_hooks';

export default function createContext<
	THook extends (params: any) => any,
	THookParams extends (Parameters<THook>[0]),
	THookRet extends ReturnType<THook>
>(hook: THook) {
	const ctx = new AsyncLocalStorage<{ value: THookRet }>();

	const use = (): THookRet => {
		const store = ctx.getStore();

		if (!store) {
			if (!ret.default) throw new Error('Context was used outside of `context.run` and has no default value!\nto fix this either wrap your code in `context.run` or provide a default value when constructing the context')

			return ret.default;
		}

		return store?.value;
	}

	const run = <TCallback extends () => any>(params: THookParams, callback: TCallback) => {
		const value = hook(params);
		return ctx.run<ReturnType<TCallback>>({ value }, callback)
	}

	const ret = {
		use,
		run,
		default: undefined as THookRet | undefined,
	};

	return ret;
}