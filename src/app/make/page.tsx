"use client";
import Link from "next/link";
import { Modal } from "@/app/_components/Modal";
import { useState, useEffect } from "react";
import type { Line } from "@/app/_types/Line";
import type { Station } from "@/app/_types/Station";
import type { RouteMap } from "@/app/_types/RouteMap";

export default function Page() {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [routeMaps, setRouteMaps] = useState<RouteMap[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/look"); // API を呼ぶ
        if (!res.ok) throw new Error("Failed to fetch");
        const data: RouteMap[] = await res.json();
        setRouteMaps(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <main>
      <div className="flex w-full justify-center py-4 text-4xl font-bold">
        作る
      </div>

      <div className="flex items-stretch justify-between space-x-10">
        <div className="flex w-1/2 flex-col items-center space-y-5">
          <div className="text-6xl font-bold">新規作成</div>
          <div>1から路線図を作り始めます</div>
          <Link href="/make/edit">
            <button
              className="rounded-md bg-indigo-500 px-8 py-1 text-white hover:bg-indigo-600 active:bg-indigo-700"
              onClick={() => {
                sessionStorage.clear();
              }}
            >
              始める
            </button>
          </Link>
        </div>

        <div className="w-[2px] bg-gray-400"></div>

        <div className="flex w-1/2 flex-col items-center space-y-5">
          <div className="text-6xl font-bold">編集</div>
          <div>既に作ってある路線図を読み込む</div>
          <button className="rounded-md bg-indigo-500 px-8 py-1 text-white hover:bg-indigo-600 active:bg-indigo-700">
            ローカルから読み込む(未実装)
          </button>
          <button
            className="rounded-md bg-indigo-500 px-8 py-1 text-white hover:bg-indigo-600 active:bg-indigo-700"
            onClick={() => {
              setIsAccountModalOpen(true);
            }}
          >
            アカウントから読み込む
          </button>
        </div>
      </div>

      <Link href="/">
        <button className="rounded-md bg-green-500 px-4 py-1 text-white hover:bg-green-600 active:bg-green-700">
          ホームに戻る
        </button>
      </Link>
      <Modal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      >
        <div>
          <div>アカウントから読み込む(仮)</div>
          <div className="flex max-h-36 w-full flex-col space-y-2 overflow-auto">
            {routeMaps?.map((routeMap) => (
              <div key={routeMap.id}>
                <Link href="/make/edit">
                  <button
                    className="flex w-full justify-between rounded-md border-2 border-slate-500 p-2 hover:border-slate-600 active:border-slate-700"
                    onClick={() => {
                      sessionStorage.setItem(
                        "routeMapData",
                        JSON.stringify(routeMap)
                      );
                    }}
                  >
                    <div>{routeMap.title}</div>
                    <div className="text-sm text-slate-500">
                      投稿日時{new Date(routeMap.createdAt).toLocaleString()}
                    </div>
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </main>
  );
}
