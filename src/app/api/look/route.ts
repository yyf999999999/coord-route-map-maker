import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    let routeMaps;
    if (id) {
      routeMaps = await prisma.routeMap.findUnique({
        where: { id },
        include: {
          station: true,
          line: true,
        },
      });

      if (!routeMaps) {
        return NextResponse.json(
          { message: "RouteMap not found" },
          { status: 404 }
        );
      }
    } else {
      routeMaps = await prisma.routeMap.findMany({
        include: {
          station: true,
          line: true,
        },
      });
    }

    return NextResponse.json(routeMaps, { status: 200 });
  } catch (error) {
    console.error("Error fetching RouteMap:", error);
    return NextResponse.json(
      { message: "Failed to fetch RouteMap", error },
      { status: 500 }
    );
  }
}
