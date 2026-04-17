import Image from 'next/image';

interface HeroProps {
  src: string | null;
  alt: string;
}

export function Hero({ src, alt }: HeroProps) {
  return (
    <div className="relative -mx-[calc(50vw-50%)] -mt-8 h-72 sm:h-96">
      {src && (
        <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" priority />
      )}
      <div className="from-base via-base/60 absolute inset-0 bg-gradient-to-t to-transparent" />
    </div>
  );
}
