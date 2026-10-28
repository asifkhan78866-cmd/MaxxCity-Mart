"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav } from "@/components/navigation";

export function NavLinks() {
  const pathname = usePathname();
  return (
    <ul className="flex items-center gap-1">
      {primaryNav.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`rounded-full px-3 py-2 text-[0.94rem] font-medium transition-colors hover:text-brand-blue ${
                active ? "text-brand-blue" : "text-ink"
              }`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
