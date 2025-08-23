import React from 'react';
import { cn } from '../../utils/cn';

const Button = React.forwardRef(({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-purple-600 text-white hover:bg-purple-700 focus-visible:ring-purple-500",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600 focus-visible:ring-yellow-500",
    info: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500"
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 py-1 text-sm",
    lg: "h-12 px-6 py-3 text-lg",
    icon: "h-10 w-10"
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

// Componentes especializados baseados no design do Brechó da Luli
export const PrimaryButton = ({ children, ...props }) => (
  <Button variant="default" {...props}>
    {children}
  </Button>
);

export const SecondaryButton = ({ children, ...props }) => (
  <Button variant="outline" {...props}>
    {children}
  </Button>
);

export const ActionButton = ({ children, icon, ...props }) => (
  <Button className="gap-2" {...props}>
    {icon && <span className="w-4 h-4">{icon}</span>}
    {children}
  </Button>
);

export const IconButton = ({ children, ...props }) => (
  <Button variant="ghost" size="icon" {...props}>
    {children}
  </Button>
);

export { Button }; 