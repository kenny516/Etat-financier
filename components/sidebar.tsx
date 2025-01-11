"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FileSpreadsheet,
    PlusCircle,
    BarChart3,
    Settings,
    HelpCircle,
} from "lucide-react";

const navigation = [
    {
        name: "Tableau de bord",
        href: "/",
        icon: LayoutDashboard
    },
    {
        name: "Saisie",
        href: "/saisie",
        icon: PlusCircle
    },
    {
        name: "Bilans",
        href: "/bilans",
        icon: FileSpreadsheet
    },
    {
        name: "Analyses",
        href: "/analyses",
        icon: BarChart3
    },
];

const secondaryNavigation = [
    {
        name: "Paramètres",
        href: "/parametres",
        icon: Settings
    },
    {
        name: "Aide",
        href: "/aide",
        icon: HelpCircle
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-56 flex-col bg-white shadow-sm border-r">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                <div className="flex flex-shrink-0 items-center px-4">
                    <h1 className="text-xl font-semibold text-gray-900">Analyse Fin.</h1>
                </div>
                <nav className="mt-8 flex-1 space-y-1 px-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                                    isActive
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "mr-3 h-5 w-5 flex-shrink-0",
                                        isActive
                                            ? "text-gray-500"
                                            : "text-gray-400 group-hover:text-gray-500"
                                    )}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="border-t border-gray-200 pt-4">
                    <nav className="space-y-1 px-2">
                        {secondaryNavigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
                            >
                                <item.icon
                                    className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
}