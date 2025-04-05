import type { Component, ComponentProps } from 'svelte';

export class RenderComponentConfig<TComponent extends Component<any>> {
	constructor(
		public component: TComponent,
		public props: ComponentProps<TComponent>
	) {}
}

export const renderComponent = <TComponent extends Component<any>>(component: TComponent, props: ComponentProps<TComponent>) =>
	new RenderComponentConfig(component, props);
