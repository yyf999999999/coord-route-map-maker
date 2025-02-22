"use client";
import Link from "next/link";
import { Modal } from "@/app/_components/Modal";
import { useState, useEffect } from "react";
import type { Line } from "@/app/_types/Line";
import type { Station } from "@/app/_types/Station";
import type { RouteMap } from "@/app/_types/RouteMap";
import { useRouter } from "next/navigation";

export default function Page() {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [routeMaps, setRouteMaps] = useState<RouteMap[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetched, setFetched] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    if (fetched) return;
    setFetched(true);
    setLoading(true);
    try {
      const res = await fetch("/api/look");
      if (!res.ok) throw new Error("Failed to fetch");
      const data: RouteMap[] = await res.json();
      setRouteMaps(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setFetched(false);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      console.error("ファイルが選択されていません");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (typeof result === "string") {
          const routeMap: RouteMap = JSON.parse(result);
          sessionStorage.setItem("routeMapData", JSON.stringify(routeMap));
          router.push("/make/edit");
        }
      } catch (error) {
        console.error("JSONの読み込みに失敗しました", error);
      }
    };

    reader.readAsText(file);
  };

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
          <label
            htmlFor="file-upload"
            className="cursor-pointer rounded-md bg-indigo-500 px-8 py-1 text-white hover:bg-indigo-600 active:bg-indigo-700"
          >
            ローカルから読み込む
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".json"
            className="hidden"
            onChange={uploadFile}
          />
          <button
            className="rounded-md bg-indigo-500 px-8 py-1 text-white hover:bg-indigo-600 active:bg-indigo-700"
            onClick={() => {
              setIsAccountModalOpen(true);
              fetchData();
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
          <div className="mb-2 font-bold">アカウントから読み込む(仮)</div>
          {loading ? (
            <div>loading...</div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="flex max-h-36 w-full flex-col space-y-2 overflow-auto">
                {routeMaps?.map((routeMap) => (
                  <div key={routeMap.id}>
                    <Link href="/make/edit">
                      <button
                        className="flex w-full justify-between rounded-md border-4 border-slate-500 p-2 hover:border-slate-600 active:border-slate-700"
                        onClick={() => {
                          sessionStorage.setItem(
                            "routeMapData",
                            JSON.stringify(routeMap)
                          );
                        }}
                      >
                        <div>{routeMap.title}</div>
                        <div className="text-sm text-slate-500">
                          投稿日時
                          {new Date(routeMap.createdAt).toLocaleString()}
                        </div>
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
              <button
                className="max-w-max rounded-md bg-red-500 px-4 py-1 text-white hover:bg-red-600 active:bg-red-700"
                onClick={() => setIsAccountModalOpen(false)}
              >
                キャンセル
              </button>
            </div>
          )}
        </div>
      </Modal>
    </main>
  );
}
