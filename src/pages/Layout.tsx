import React from "react";
import sideImageAuth from "@/assets/sideImageAuth.png";

export const AuthLayout = ({ CardContent }: { CardContent: React.FC }) => {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <CardContent />
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src={sideImageAuth}
          alt="Authentication side image"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};
