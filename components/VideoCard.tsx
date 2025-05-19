'use client';

import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { Play } from "lucide-react";
import { motion } from "framer-motion";

interface VideoCardProps {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  videoEmbed: string;
  description: string;
}

export function VideoCard({ id, title, slug, thumbnail, description }: VideoCardProps) {
  return (
    <Link href={`/video/${slug}`}>
        <div className="cursor-pointer overflow-hidden rounded-lg bg-[#181818]">
          <div className="relative">
            <div className="group relative">
              <AspectRatio ratio={16 / 9}>
                <Image
                  src={thumbnail}
                  alt={title}
                  fill
                  className="object-cover transition-all duration-300"
                />
              </AspectRatio>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 transition-opacity duration-300">
                <Play className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-gray-400">{description}</p>
          </div>
        </div>
    </Link>
  );
}