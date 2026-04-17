import Image from 'next/image';

import { profileUrl } from '@/lib/tmdb/client';
import type { CastMember } from '@/types/tmdb';

interface CastGridProps {
  cast: CastMember[];
  limit?: number;
}

export function CastGrid({ cast, limit }: CastGridProps) {
  const members = limit ? cast.slice(0, limit) : cast;
  if (members.length === 0) return null;

  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
      {members.map((member) => {
        const profile = profileUrl(member.profile_path, 'w185');
        return (
          <div
            key={`${member.id}-${member.character}`}
            className="flex flex-col items-center gap-1 text-center"
          >
            <div className="bg-subtle relative h-16 w-16 overflow-hidden rounded-full">
              {profile && (
                <Image
                  src={profile}
                  alt={member.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              )}
            </div>
            <p className="text-foreground text-xs font-medium">{member.name}</p>
            <p className="text-muted text-xs">{member.character}</p>
          </div>
        );
      })}
    </div>
  );
}
