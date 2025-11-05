
'use client';

import { GraduationCap } from "lucide-react";

export default function SplashScreen() {
  return (
    <div className="splash-screen">
        <div className="splash-logo-container">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary">
                <GraduationCap className="h-12 w-12 text-primary-foreground" />
            </div>
        </div>
    </div>
  );
}
