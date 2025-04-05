import { tv, type VariantProps } from 'tailwind-variants';

const inputVariants = tv({
	/* base: 'inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50', */
	base: 'rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
	variants: {
		variant: {
			default: 'bg-surface-50 text-surface-950',
			destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
			outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
			secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
			ghost: 'hover:bg-accent hover:text-accent-foreground',
			link: 'text-primary underline-offset-4 hover:underline'
		},
		size: {
			default: '',
			sm: 'h-8 rounded-md px-3 text-xs',
			md: 'h-8 rounded-md px-3 text-sm',
			lg: 'h-10 rounded-md px-8 text-md',
			icon: 'h-9 w-9'
		}
	},
	defaultVariants: {
		variant: 'default',
		size: 'default'
	}
});
type InputVariantType = VariantProps<typeof inputVariants>['variant'];
type InputSizeType = VariantProps<typeof inputVariants>['size'];

export { inputVariants, type InputVariantType, type InputSizeType };
