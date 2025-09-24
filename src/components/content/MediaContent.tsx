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
        ) : (
          <div className="w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-md flex items-center justify-center">
            <div className="text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-500 text-sm font-medium">Hình ảnh</span>
            </div>
          </div>
        );
      })()}

      {/* YouTube Video Display */}
      {videoUrl && getYouTubeEmbedUrl(videoUrl) && (
        <div className="w-full">
          <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden shadow-md">
            <iframe
              src={getYouTubeEmbedUrl(videoUrl) || undefined}
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