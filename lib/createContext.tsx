import React from 'react';

const NO_CONTEXT = Symbol('NO_CONTEXT');

export type ContextLogicHook<TProps, TContext> = (props: TProps) => TContext;

export default function createContext<
	TContextHook extends (props?: any) => any,
	// util types
	TContextValue extends ReturnType<TContextHook>
>(
	useContextValue: TContextHook,
	options: {
		defaultValue?: typeof NO_CONTEXT | TContextValue;
	} = {}
) {
	const { defaultValue = NO_CONTEXT } = options;

	const Ctx = React.createContext<TContextValue>(defaultValue as any);

	type TProps = Parameters<TContextHook>['length'] extends 0
		? {}
		: Parameters<TContextHook>[0];
	type TProviderProps = React.PropsWithChildren<TProps>;

	const ProviderComp = (props: TProviderProps) => {
		const value = useContextValue(props);

		return <Ctx.Provider value={value}>{props.children}</Ctx.Provider>;
	};

	function useCtx() {
		const ctx = React.useContext(Ctx);

		if ((ctx as any) === NO_CONTEXT) {
			throw new Error(
				'use context called while not within a context provider'
			);
		}

		return ctx;
	}

	function withProvider<T extends (props: any) => JSX.Element>(
		Comp: T,
		providerProps:
			| TProps
			| ((props: React.ComponentProps<T>) => TProps) = {}
	): T {
		return ((props: any) => {
			const _providerProps =
				typeof providerProps === 'function'
					? (providerProps as any)(props)
					: providerProps;

			return (
				<ProviderComp {..._providerProps}>
					<Comp {...props} />
				</ProviderComp>
			);
		}) as T;
	}

	return { Provider: ProviderComp, use: useCtx, wrap: withProvider };
}
