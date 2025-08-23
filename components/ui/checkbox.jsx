import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/utils"

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative">
    <input
      type="checkbox"
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className
      )}
      ref={ref}
      {...props}
    />
    <Check className="absolute left-0 top-0 h-4 w-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
  </div>
))
Checkbox.displayName = "Checkbox"

export { Checkbox } 