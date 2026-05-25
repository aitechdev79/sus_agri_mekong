import Image from 'next/image'

interface PartnerLogoCardProps {
  companyName: string
  logoUrl: string | null
  website: string | null
  priority?: boolean
}

function normalizeWebsiteUrl(website: string | null) {
  const value = website?.trim()
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value
  if (/^(www\.)?[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(value)) return `https://${value}`
  return null
}

export default function PartnerLogoCard({ companyName, logoUrl, website, priority = false }: PartnerLogoCardProps) {
  const href = normalizeWebsiteUrl(website)
  const cardClassName =
    'group flex h-28 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-4 shadow-sm transition-all duration-300 hover:border-[#FFB81C] hover:shadow-lg sm:h-32 sm:px-6 md:h-36 md:px-8'

  const content = (
    <div className="relative flex h-14 w-full max-w-[78%] items-center justify-center transition-transform duration-300 group-hover:scale-[1.03] sm:h-16 md:h-20 md:max-w-[72%]">
      <Image
        src={logoUrl || '/Logo_Vinamilk_(2023).png'}
        alt={companyName}
        fill
        className="object-contain"
        sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 25vw"
        priority={priority}
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
