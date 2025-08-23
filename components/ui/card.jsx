import React from 'react';
import { cn } from '../../utils/cn';

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-gray-200 bg-white shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight text-gray-900", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// Componente especializado para métricas (baseado nas imagens do dashboard)
const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  iconColor = "bg-blue-500",
  trend,
  className,
  ...props 
}) => (
  <Card className={cn("p-6", className)} {...props}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-500">{subtitle}</p>
        )}
        {trend && (
          <p className={cn(
            "text-sm font-medium mt-1",
            trend.type === 'positive' ? "text-green-600" : 
            trend.type === 'negative' ? "text-red-600" : "text-gray-600"
          )}>
            {trend.value}
          </p>
        )}
      </div>
      {icon && (
        <div className={cn(
          "flex items-center justify-center w-12 h-12 rounded-lg",
          iconColor
        )}>
          <div className="w-6 h-6 text-white">
            {icon}
          </div>
        </div>
      )}
    </div>
  </Card>
);

// Componente para cards de clientes (baseado na tela de clientes)
const ClientCard = ({ 
  name, 
  phone, 
  email, 
  totalCompras, 
  totalGasto,
  onEdit,
  onDelete,
  className,
  ...props 
}) => (
  <Card className={cn("p-6", className)} {...props}>
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <div className="space-y-1 mt-2">
          {phone && (
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span>📞</span> {phone}
            </p>
          )}
          {email && (
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span>✉️</span> {email}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center py-2 border-t border-gray-100">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-600">
            🛒 Total de Compras: <span className="font-medium text-gray-900">{totalCompras}</span>
          </span>
          <span className="text-gray-600">
            💰 Total Gasto: <span className="font-medium text-green-600">{totalGasto}</span>
          </span>
        </div>
      </div>
      
      <div className="flex gap-2 pt-2">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          ✏️ Editar
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-2 px-3 py-2 text-sm text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
        >
          🗑️ Excluir
        </button>
      </div>
    </div>
  </Card>
);

export { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  MetricCard,
  ClientCard
}; 