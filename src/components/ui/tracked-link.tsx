"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { type AnalyticsEvent, track } from "@/lib/analytics/track";

type Props = ComponentProps<"a"> & {
  href: string;
  event: AnalyticsEvent;
  placement?: string;
  store?: string;
};

/**
 * A link that records a non-personal analytics event when clicked.
 * External, tel: and wa.me links render a plain anchor; internal links use next/link.
 */
export function TrackedLink({ href, event, placement, store, onClick, ...rest }: Props) {
  const handle: Props["onClick"] = (e) => {
    track(event, { placement, store });
    onClick?.(e);
  };
  const external = /^(https?:|tel:|mailto:)/.test(href);
  if (external) {
    const newTab = href.startsWith("http");
    return (
      <a
        href={href}
        onClick={handle}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      />
    );
  }
  return <Link href={href} onClick={handle} {...rest} />;
}
