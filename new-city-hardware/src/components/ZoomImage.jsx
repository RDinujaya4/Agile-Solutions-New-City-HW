import { useRef } from 'react';

export default function ZoomImage({ src, alt }) {
  const imageRef = useRef();

  const handleMouseMove = (e) => {
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;

    imageRef.current.style.transformOrigin = `${x}% ${y}%`;
  };

  return (
    <div
      className="zoom-container w-full h-96 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => (imageRef.current.style.transformOrigin = 'center')}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="zoom-image object-contain w-full h-full"
      />
    </div>
  );
}
