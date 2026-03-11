import { redirect } from 'next/navigation'

export default async function LegacySignUpRedirect({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>
}) {
  const { role } = await searchParams
  const roleQuery = role ? `?role=${encodeURIComponent(role)}` : ''
  redirect(`/vi/auth/signup${roleQuery}`)
}
