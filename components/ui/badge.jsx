import React from 'react';
import { cn } from '../../utils/cn';

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    destructive: "bg-red-100 text-red-800 hover:bg-red-200",
    success: "bg-green-100 text-green-800 hover:bg-green-200",
    warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    info: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    purple: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

// Componentes especializados para o Brechó da Luli
export const CategoryBadge = ({ children, ...props }) => (
  <Badge 
    variant="default" 
    className="bg-gray-100 text-gray-700 font-medium"
    {...props}
  >
    {children}
  </Badge>
);

export const StatusBadge = ({ status, ...props }) => {
  const statusVariants = {
    disponivel: "success",
    vendido: "destructive", 
    reservado: "warning",
    inativo: "default"
  };

  const statusLabels = {
    disponivel: "Disponível",
    vendido: "Vendido",
    reservado: "Reservado", 
    inativo: "Inativo"
  };

  return (
    <Badge variant={statusVariants[status] || "default"} {...props}>
      {statusLabels[status] || status}
    </Badge>
  );
};

export const PriceBadge = ({ children, isDiscount = false, ...props }) => (
  <Badge 
    variant={isDiscount ? "destructive" : "success"}
    className={isDiscount ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}
    {...props}
  >
    {children}
  </Badge>
);

export { Badge }; 