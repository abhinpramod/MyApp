import { X } from "lucide-react";

const MediaPreview = ({ media, onRemove, isOwnerView }) => {
  return (
    <div className="relative group">
      {media.type === 'image' ? (
        <img
          src={media.url}
          alt="Preview"
          className="w-full h-32 object-cover rounded-lg"
          loading="lazy"
        />
      ) : (
        <video
          src={media.url}
          className="w-full h-32 object-cover rounded-lg"
          controls={false}
        />
      )}
      {isOwnerView && (
        <button
          onClick={() => onRemove(media.id)}
          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X size={16} />
        </button>
      )}
      <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
        {media.type === 'image' ? 'Image' : 'Video'}
      </div>
    </div>
  );
};

export default MediaPreview;