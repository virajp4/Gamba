"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef(({ className, markerValue, ...props }, ref) => {
  const markerPosition = (markerValue / 100) * 100;

  return (
    <div className="relative w-full">
      <SliderPrimitive.Root ref={ref} className={cn("relative flex w-full touch-none select-none items-center", className)} {...props}>
        {" "}
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-red-500">
          <SliderPrimitive.Range className="absolute h-full bg-green-500" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-zinc-900 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-50 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300" />
      </SliderPrimitive.Root>
      {markerValue && <div
        className="absolute top-[-60px] transform -translate-x-1/2 bg-transparent text-white text-md rounded flex flex-col justify-center items-center transition-all duration-300 ease-in-out"
        style={{ left: `${markerPosition}%` }}
      >
        {markerValue}
        <MapPin size={32} />
      </div>}
    </div>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
