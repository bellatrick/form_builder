"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const ErrorPage = ({ error }: { error: Error }) => {

  return <div className="flex w-full h-full flex-col mb-2 items-center justify-center">
    <h2 className="text-4xl">Something went wrong!</h2>
    <Button asChild>
        <Link href='/'>Go back home</Link>
    </Button>
  </div>;
};

export default ErrorPage;
