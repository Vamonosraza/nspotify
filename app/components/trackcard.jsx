import Image from "next/image"
import { formatDuration } from "../../utils/spotify"
import { Play, ExternalLink } from "lucide-react"

export default function TrackCard({ track, type = "track" }) {
  // Get the correct data based on content type
  const getCardData = () => {
    switch (type) {
      case "track":
        return {
          title: track.name,
          subtitle: track.artists?.map((artist) => artist.name).join(", "),
          imageUrl: track.album?.images[0]?.url,
          duration: formatDuration(track.duration_ms),
          externalUrl: track.external_urls?.spotify,
        }
      case "artist":
        return {
          title: track.name,
          subtitle: `${track.followers?.total?.toLocaleString() || 0} followers`,
          imageUrl: track.images?.[0]?.url,
          externalUrl: track.external_urls?.spotify,
        }
      case "album":
        return {
          title: track.name,
          subtitle: track.artists?.map((artist) => artist.name).join(", "),
          imageUrl: track.images?.[0]?.url,
          externalUrl: track.external_urls?.spotify,
        }
      case "playlist":
        return {
          title: track.name,
          subtitle: `By ${track.owner?.display_name || "Unknown"} • ${track.tracks?.total || 0} tracks`,
          imageUrl: track.images?.[0]?.url,
          externalUrl: track.external_urls?.spotify,
        }
      default:
        return {
          title: track.name,
          subtitle: "",
          imageUrl: null,
          externalUrl: "#",
        }
    }
  }

  const cardData = getCardData()

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-2xl transition-all ease-in-out duration-300 transform hover:scale-105">
      <div className="flex gap-4 md:gap-6">
        {cardData.imageUrl ? (
          <div className="relative w-16 md:w-20 h-16 md:h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 border-purple-600">
            <Image
              src={cardData.imageUrl || "/placeholder.svg"}
              alt={cardData.title}
              className="object-cover rounded-lg"
              fill
              sizes="(max-width: 768px) 64px, 80px"
              priority={false}
            />
          </div>
        ) : (
          <div className="w-16 md:w-20 h-16 md:h-20 bg-gray-600 rounded-lg flex-shrink-0" />
        )}
        <div className="flex-grow min-w-0">
          <h3 className="font-semibold text-xl md:text-2xl text-white truncate">{cardData.title}</h3>
          <p className="text-purple-300 text-sm truncate mb-2">{cardData.subtitle}</p>
          <div className="flex items-center gap-3 md:gap-4 mt-2 md:mt-3">
            {cardData.duration && <span className="text-sm text-gray-400">{cardData.duration}</span>}
            {cardData.externalUrl && (
              <a
                href={cardData.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 hover:text-green-600 transition-colors"
                aria-label={`Open ${type} in Spotify`}
              >
                <ExternalLink size={18} />
              </a>
            )}
            <button className="text-purple-500 hover:text-purple-400 transition-colors" aria-label={`Play ${type}`}>
              <Play size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

