import { permanentRedirect } from "next/navigation";

type MetadataParams = { params: Promise<{ id: string }> };

export const instant = false;

export default async function PrestadorRedirectPage({ params }: MetadataParams) {
  const { id } = await params;
  permanentRedirect(`/prestador/${id}`);
}
