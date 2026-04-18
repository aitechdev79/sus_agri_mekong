import Image from 'next/image'

interface PartnerLogoCardProps {
  companyName: string
  logoUrl: string | null
  website: string | null
}

function normalizeWebsiteUrl(website: string | null) {
  const value = website?.trim()
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value
  if (/^(www\.)?[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(value)) return `https://${value}`
  return null
}

export default function PartnerLogoCard({ companyName, logoUrl, website }: PartnerLogoCardProps) {
  const href = normalizeWebsiteUrl(website)
  const cardClassName =
    'group flex h-36 items-center justify-center rounded-lg border border-gray-200 bg-white px-8 py-6 shadow-sm transition-all duration-300 hover:border-[#FFB81C] hover:shadow-lg'

  const content = (
    <div className="relative flex h-20 w-full max-w-[72%] items-center justify-center transition-transform duration-300 group-hover:scale-[1.03]">
      <Image
        src={logoUrl || '/Logo_Vinamilk_(2023).png'}
        alt={companyName}
        fill
        className="object-contain"
        sizes="(max-width: 768px) 50vw, 220px"
      />
    </div>
  )

  if (!href) {
    return <div className={cardClassName}>{content}</div>
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${cardClassName} cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FFB81C] focus:ring-offset-2`}
      aria-label={`Mở website ${companyName}`}
    >
      {content}
    </a>
  )
}
