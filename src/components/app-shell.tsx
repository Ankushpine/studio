'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Home,
  BookHeart,
  Smile,
  BarChart3,
  CheckSquare,
  BrainCircuit,
  Bot,
  Feather,
} from 'lucide-react';
import { Button } from './ui/button';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/mood-tracker', icon: Smile, label: 'Mood Log' },
  { href: '/journal', icon: BookHeart, label: 'Journal' },
  { href: '/trends', icon: BarChart3, label: 'Trends' },
  { href: '/habits', icon: CheckSquare, label: 'Habits' },
  { href: '/exercises', icon: BrainCircuit, label: 'Exercises' },
  { href: '/chatbot', icon: Bot, label: 'Clarity Bot' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Feather className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="font-headline text-lg font-bold text-primary-foreground/90 group-data-[collapsible=icon]:hidden">
              Clarity Hub
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm sm:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            <h1 className="font-headline text-xl font-semibold">
              {navItems.find((item) => item.href === pathname)?.label || 'Dashboard'}
            </h1>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
