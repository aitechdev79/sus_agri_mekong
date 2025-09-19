import Image from 'next/image';
import { normalizeImageUrl } from '@/lib/image-utils';

interface MediaContentProps {
  imageUrl?: string;
  videoUrl?: string;
  title?: string;
}

export function MediaContent({ imageUrl, videoUrl, title }: MediaContentProps) {
  const getYouTubeId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = getYouTubeId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  return (
    <div className="space-y-6">
      {/* Image Display */}
      {(() => {
        const normalizedImageUrl = normalizeImageUrl(imageUrl);
        return normalizedImageUrl ? (
          <div className="w-full relative aspect-video">
            <Image
              src={normalizedImageUrl}
              alt={title || 'Content image'}
              fill
              className="object-cover rounded-lg shadow-md"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : null;
      })()}

      {/* YouTube Video Display */}
      {videoUrl && getYouTubeEmbedUrl(videoUrl) && (
        <div className="w-full">
          <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden shadow-md">
            <iframe
              src={getYouTubeEmbedUrl(videoUrl)}
              title={title || 'YouTube video'}
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Invalid YouTube URL fallback */}
      {videoUrl && !getYouTubeEmbedUrl(videoUrl) && (
        <div className="w-full p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>Video:</strong>{' '}
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {videoUrl}
            </a>
          </p>
          <p className="text-yellow-700 text-xs mt-1">
            Link không hợp lệ cho YouTube embed. Bấm để xem video.
          </p>
        </div>
      )}
    </div>
  );
}