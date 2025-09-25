// components/FindConnectionsCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

const DEEP_GREEN = "bg-[#006600]";
const GRAY = "bg-gray-500 opacity-80";

interface FindConnectionsCardProps {
  onFindConnectionsClick: () => void;
  hasConsent: boolean;
}

export function FindConnectionsCard({ onFindConnectionsClick, hasConsent }: FindConnectionsCardProps) {
  // We place the onClick handler on a simple div wrapper to safely contain the interactivity.
  return (
    <div
      onClick={onFindConnectionsClick}
      className="cursor-pointer" // Add pointer cursor
    >
      <Card
        className={`text-white shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105 ${
          hasConsent ? DEEP_GREEN : GRAY
        }`}
      >
        <CardContent className="flex flex-col items-center justify-center space-y-2 p-4 text-center">
          <User className="h-6 w-6" />
          <div className="font-semibold text-base">Find Connections</div>
        </CardContent>
      </Card>
    </div>
  );
}