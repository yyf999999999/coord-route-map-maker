import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Station } from "@/app/_types/Station";
import { Line } from "@/app/_types/Line";

type RequestBody = {
  id: string;
  title: string;
  station: Station[];
  line: Line[];
  createdAt: string;
};

export async function POST(req: Request) {
  try {
    let body: RequestBody;
    try {
      body = await req.json();
    } catch (error) {
      console.error("JSON パースエラー:", error);
      return NextResponse.json(
        { message: "Invalid JSON body", error: String(error) },
        { status: 400 }
      );
    }

    console.log("受け取ったデータ:", JSON.stringify(body, null, 2));

    const newRouteMap = await prisma.routeMap.create({
      data: {
        id: body.id,
        title: body.title,
        createdAt: new Date(body.createdAt),
        station: {
          create: body.station.map((s) => ({
            id: s.id,
            name: s.name,
            pos: s.pos as [number, number],
            scale: s.scale,
          })),
        },
        line: {
          create: body.line.map((l) => ({
            id: l.id,
            name: l.name,
            color: l.color,
            station: l.station,
            ring: l.ring,
          })),
        },
      },
      include: {
        station: true,
        line: true,
      },
    });

    console.log("成功: RouteMap 作成:", JSON.stringify(newRouteMap, null, 2));
    return NextResponse.json(newRouteMap, { status: 201 });
  } catch (error) {
    console.error("データベースエラー:", error);
    return NextResponse.json(
      { message: "Failed to create RouteMap", error: String(error) },
      { status: 500 }
    );
  }
}
