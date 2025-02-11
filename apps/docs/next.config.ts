import type { NextConfig } from "next";
import nextra from "nextra";

const withNextra = nextra({});

const nextConfig: NextConfig = { output: "standalone" };

export default withNextra(nextConfig);
