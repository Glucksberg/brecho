import { Card, CardContent } from '@/components/ui'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  format?: 'currency' | 'number' | 'text'
  subtitle?: string
}

export function StatCard({ title, value, icon, trend, format = 'text', subtitle }: StatCardProps) {
  let formattedValue = value

  if (format === 'currency' && typeof value === 'number') {
    formattedValue = formatCurrency(value)
  } else if (format === 'number' && typeof value === 'number') {
    formattedValue = formatNumber(value)
  }

  return (
    <Card variant="bordered" className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{formattedValue}</p>

            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}

            {trend && (
              <div className="flex items-center gap-1 mt-2">
                {trend.isPositive ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span
                  className={`text-sm font-medium ${
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {trend.value > 0 && '+'}{trend.value.toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs mês anterior</span>
              </div>
            )}
          </div>

          <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
