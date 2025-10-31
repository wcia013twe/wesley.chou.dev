import React from "react";
import { ScrollStackItem } from "./ScrollStack";
import IconBubblePit from "./IconBubblePit";

export interface ScrollStackCardProps {
  title: string;
  images: React.ReactNode[];
}
const ScrollStackCard = ({ title, images }: ScrollStackCardProps) => {
  return (
    <ScrollStackItem itemClassName="bg-gray-900 text-xs border border-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
        <h2 className="text-2xl font-semibold mb-4 text-white">{title}</h2>
        <IconBubblePit items={images} height={220} radius={45}/>
      </div>
    </ScrollStackItem>
  );
};

export default ScrollStackCard;
