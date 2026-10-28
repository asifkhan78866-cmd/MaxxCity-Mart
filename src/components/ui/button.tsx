import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "green" | "outline" | "light" | "outline-light" | "yellow";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-[background-color,color,border-color,transform,box-shadow] duration-200 hover:-translate-y-px active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 text-center";

const variants: Record<Variant, string> = {
  primary: "bg-brand-blue text-white hover:bg-brand-blue-deep shadow-sm",
  green: "bg-brand-green text-white hover:bg-brand-green-deep shadow-sm",
  outline: "border-2 border-ink/15 text-ink hover:border-brand-blue hover:text-brand-blue bg-white",
  light: "bg-white text-ink hover:bg-paper shadow-sm",
  "outline-light": "border-2 border-white/40 text-white hover:border-white hover:bg-white/10",
  yellow: "bg-price-yellow text-ink hover:bg-[#ffd451] shadow-sm",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-6 text-base",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className = "",
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size };

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link {...props} className={buttonClasses({ variant, size, className })} />;
}
