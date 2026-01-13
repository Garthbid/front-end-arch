import * as React from "react"
import { cn } from "../../utils/cn"

const TooltipProvider = ({ children }: { children: React.ReactNode }) => <div className="relative inline-block group">{children}</div>

const Tooltip = ({ children }: { children: React.ReactNode }) => <>{children}</>

const TooltipTrigger = ({ children, asChild }: { children: React.ReactNode, asChild?: boolean }) => {
    return <div className="inline-block cursor-help">{children}</div>
}

const TooltipContent = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <div className={cn(
            "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50",
            className
        )}>
            {children}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
    )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
