import React from "react";
import type { Route } from "../../+types/root";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Omega3" },
    { name: "description", content: "Welcome to Omega3!" },
  ];
}

const Homepage = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center gap-4">
      <Link to="/sign-in">
        <Button className="bg-black text-white w-100">Login</Button>
      </Link>
      <Link to="/sign-up">
        <Button variant="outline" className="bg-black text-white w-100">
          Sign Up
        </Button>
      </Link>
    </div>
  );
};

export default Homepage;
