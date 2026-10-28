import { after, type NextRequest } from "next/server";
import { findForm } from "@/lib/forms/registry";
import { reply, submitForm } from "@/lib/forms/submit";

/** POST /api/forms/{franchise|product-request|manufacturer|retailer|contact|location-interest} */
export async function POST(request: NextRequest, ctx: RouteContext<"/api/forms/[form]">) {
  const definition = findForm((await ctx.params).form);
  if (!definition) return reply({ ok: false, message: "Unknown form." }, 404);
  return submitForm(definition, request, { defer: after });
}
